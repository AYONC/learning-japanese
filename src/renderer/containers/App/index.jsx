import * as React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
// import { bindActionCreators } from 'redux';
import { Button } from 'renderer/components/Button';
import * as AppActions from 'renderer/redux/actions/App';
import Event from 'Event';
import * as styles from './styles.css';
import { ButtonColor } from '../../components/Button';
import PropTypes from 'prop-types';

const { ipcRenderer } = window.require('electron');

export class App extends React.Component {
  static propTypes = {
    updateList: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    ipcRenderer.on(Event.SENDLIST, (event, args) => {
      this.props.updateList(args);
    });
    ipcRenderer.send(Event.REQUESTLIST);
  }

  render() {
    return (
      <div>
        <div className={styles.body}>
          <p className={styles.message}>암기보다 개발이 쉬웠어요</p>
          <Link to="/dictionary">
            <Button label="전체보기" />
          </Link>
          <br />
          <br />
          <br />
          <br />
          <Link to="/card">
            <Button label="암기모드" color={ButtonColor.SECONDARY} />
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ state });

// TODO refac using bindActionCreators
const mapDispatchToProps = dispatch => ({
  updateList: list => dispatch(AppActions.updateList(list)),
});

export const ConnectedApp = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { pure: false },
  )(App),
);
