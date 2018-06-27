import * as React from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import { withRouter } from 'react-router-dom';
import { TopBar } from 'renderer/containers/TopBar';
import { WordList } from 'renderer/components/WordList';
import * as AppActions from 'renderer/redux/actions/App';
import { barHeight, windowMaxHeight } from 'Constant';
import Event from 'Event';
import * as styles from './styles.css';
import { HiraganaOrder } from 'renderer/components/WordSet';
import { WordItem } from 'renderer/components/WordItem';
import { createSelector } from 'reselect';
import Scrollbars from 'react-custom-scrollbars';

const { ipcRenderer } = window.require('electron');

export class Card extends React.Component {
  constructor(props, context) {
    super(props, context);
    ipcRenderer.on(Event.SENDLIST, (event, args) =>
      this.props.updateList(args)
    );
    ipcRenderer.send(Event.REQUESTLIST);
    const window = remote.getCurrentWindow();
    const bounds = window.getBounds();
    window.setBounds(Object.assign(bounds, { width: 350, height: 350 }));
  }

  renderItem() {
    const { state } = this.props;
    const result = [];
    const list = state.app.list;
    const wordMap = {};
    if (list !== undefined) {
      list.forEach(set => {
        HiraganaOrder.forEach((key, idx) => {
          const temp = set[key];
          if (temp) {
            wordMap[key] = temp;
          }
        });
      });

      Object.keys(wordMap).forEach(key => {
        const list = wordMap[key];
        list.forEach((item, idx) => {
          result.push(<WordItem key={`WordItem_${key}_${idx}`} item={item}/>)
        })
      });
    }

    return result;
  }
  render() {
    console.log(this.props);
    return (
      <div>
        <TopBar title="암기" onBack={() => {
          this.props.history.goBack();
        }}/>
        <div className={styles.body}>
          {this.renderItem()}
          {/*<WordList list={this.props.wordMap}/>*/}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ state });

const mapDispatchToProps = (dispatch) => ({
  updateList: (list) => dispatch(AppActions.updateList(list)),
});

export const ConnectedCard = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false },
)(Card));