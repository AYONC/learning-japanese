import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TopBar } from 'renderer/containers/TopBar';
import { WordList } from 'renderer/components/WordList';
import * as AppActions from 'renderer/redux/actions/App';
import { barHeight, windowMaxHeight } from 'Constant';
import Event from 'Event';
import * as styles from './styles.css';

const { ipcRenderer } = window.require('electron');

export class Learn extends React.Component {
  static propTypes = {
    updateList: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    ipcRenderer.on(Event.SENDLIST, (event, args) => {
      const { updateList } = this.props;
      updateList(args);
    });
    ipcRenderer.send(Event.REQUESTLIST);
  }

  render() {
    const { history, state } = this.props;
    return (
      <div>
        <TopBar
          title=""
          onBack={() => {
            history.goBack();
          }}
        />
        <div className={styles.body}>
          <Scrollbars
            autoHeight
            autoHeightMin={windowMaxHeight - barHeight}
            autoHeightMax={windowMaxHeight - barHeight}
            renderThumbHorizontal={props => <div {...props} className={styles.scrollThumb} />}
            renderThumbVertical={props => <div {...props} className={styles.scrollThumb} />}
          >
            <WordList list={state.app.list} />
          </Scrollbars>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  updateList: list => dispatch(AppActions.updateList(list)),
});

export const ConnectedLearn = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false },
)(Learn));
