import * as React from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import { withRouter } from 'react-router-dom';
import * as AppActions from 'renderer/redux/actions/App';
import Event from 'Event';
import { HiraganaOrder } from 'renderer/components/WordSet';
import PropTypes from 'prop-types';
import { CardItem } from 'renderer/components/CardItem';
import * as styles from './styles.css';
import { TopBar } from 'renderer/containers/TopBar';

const { ipcRenderer } = window.require('electron');

export class Card extends React.Component {
  static propTypes = {
    state: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    ipcRenderer.on(Event.SENDLIST, (event, args) =>
      this.props.updateList(args),
    );
    ipcRenderer.send(Event.REQUESTLIST);
    const window = remote.getCurrentWindow();
    // const bounds = window.getBounds();
    const screenBound = remote.screen.getPrimaryDisplay().bounds;
    // window.setFullScreen(true);
    window.setBounds(screenBound);
  }

  renderItem() {
    const { state } = this.props;
    const result = [];
    const { list } = state.app;
    const wordMap = {};
    if (list !== undefined) {
      list.forEach(set => {
        HiraganaOrder.forEach(key => {
          const temp = set[key];
          if (temp) {
            wordMap[key] = temp;
          }
        });
      });

      Object.keys(wordMap).forEach(key => {
        const listItem = wordMap[key];
        listItem.forEach((item, idx) => {
          result.push(
            <CardItem key={`CardItem_${key}_${idx}`} item={item} show />,
          );
        });
      });
    }

    return result;
  }

  render() {
    const { history } = this.props;
    return (
      <>
        <TopBar
          title={`Card`}
          onBack={() => {
            history.goBack();
          }}
        />
        <div
          className={styles.root}
          style={{
            height: '100%',
            maxHeight: '200%',
            display: 'block',
            overflow: 'scroll',
          }}
        >
          <div>{this.renderItem()}</div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  updateList: list => dispatch(AppActions.updateList(list)),
});

export const ConnectedCard = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { pure: false },
  )(Card),
);
