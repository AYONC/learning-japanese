import * as React from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
import { withRouter } from 'react-router-dom';
import * as AppActions from 'renderer/redux/actions/App';
import Event from 'Event';
import { HiraganaOrder } from 'renderer/components/WordSet';
import PropTypes from 'prop-types';
import { CardItem } from 'renderer/components/CardItem';
import { TopBar } from 'renderer/containers/TopBar';
import * as styles from './styles.css';

const { ipcRenderer } = window.require('electron');

class CardSection extends React.Component {
  static propTypes = {
    set: PropTypes.object.isRequired,
    wordMap: PropTypes.object.isRequired,
    showMean: PropTypes.bool.isRequired,
    showFuri: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { isShow: false };
  }

  renderItem(wordMap) {
    const { showMean, showFuri } = this.props;
    const result = [];
    Object.keys(wordMap).forEach(key => {
      const listItem = wordMap[key];
      listItem.forEach(item => {
        result.push(
          <CardItem key={`${JSON.stringify(item)}`} item={item} showMean={showMean} showFuri={showFuri} />,
        );
      });
    });

    return result;
  }

  render() {
    const { wordMap, set } = this.props;
    const { isShow } = this.state;
    return (
      <>
        <div
          onClick={() => this.setState({ isShow: !isShow })}
          className={styles.section}
        >
          {`>> ${set.id}주차`}
        </div>
        <div
          style={{
            display: isShow ? 'block' : 'none',
          }}
        >
          {this.renderItem(wordMap)}
        </div>
      </>
    );
  }
}

export class Card extends React.Component {
  static propTypes = {
    state: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = { showMean: true, showFuri: true };
    this.toggleMean = this.toggleMean.bind(this);
    this.toggleFuri = this.toggleFuri.bind(this);

    ipcRenderer.on(Event.SENDLIST, (event, args) => this.props.updateList(args));
    ipcRenderer.send(Event.REQUESTLIST);
    const window = remote.getCurrentWindow();
    // const bounds = window.getBounds();
    const screenBound = remote.screen.getPrimaryDisplay().bounds;
    // window.setFullScreen(true);
    window.setBounds(screenBound);
  }

  toggleMean() {
    const { state } = this;
    this.setState(Object.assign(state, { showMean: !state.showMean }));
  }

  toggleFuri() {
    const { state } = this;
    this.setState(Object.assign(state, { showFuri: !state.showFuri }));
  }

  renderSet() {
    const { state } = this.props;
    const { showFuri, showMean } = this.state;
    const result = [];
    const { list } = state.app;
    if (list !== undefined) {
      list.forEach(set => {
        const wordMap = {};
        HiraganaOrder.forEach(key => {
          const temp = set[key];
          if (temp) {
            if (wordMap[key]) {
              wordMap[key] = [...wordMap[key], ...temp];
            } else {
              wordMap[key] = temp;
            }
          }
        });
        const setView = (
          <CardSection set={set} wordMap={wordMap} showFuri={showFuri} showMean={showMean} />
        );
        result.push(setView);
      });
    }

    return result;
  }

  render() {
    const { history } = this.props;
    const { showMean, showFuri } = this.state;
    return (
      <>
        <TopBar
          title="Card"
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
          <div>
            <input
              className={styles.input}
              type="checkbox"
              label="뜻 감추기"
              value="뜻 감추기"
              id="hideWord"
              defaultChecked={showMean}
              onClick={this.toggleMean}
            />
            뜻 감추기
            <input
              className={styles.input}
              type="checkbox"
              label="후리가나 감추기"
              value="후리가나 감추기"
              id="hideFuri"
              defaultChecked={showFuri}
              onClick={this.toggleFuri}
            />
            후리가나 감추기
          </div>
          <div>
            {this.renderSet()}
          </div>
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
