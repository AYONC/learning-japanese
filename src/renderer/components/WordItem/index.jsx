import * as React from 'react';
import PropTypes from 'prop-types';
import * as styles from './styles.css';
import ReactFuri from 'react-furi';
import styled from 'styled-components';

export class WordItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  getMean() {
    return this.props.item.mean.join(', ');
  }

  render() {
    const MyWrapper = styled(ReactFuri.Wrapper)`
      width: 100%;
      display: block;
      font-family: Chig;
      text-align: center;
      vertical-align: middle;
    `;
    const MyFuriPair = styled(ReactFuri.Pair)`
      font-family: Chig;
    `;
    const MyFuriFury = styled(ReactFuri.Text)`
      font-family: Chig;
      font-size: 70px; 
     `;

    const MyFuriText = styled(ReactFuri.Furi)`
      font-family: Chig;
      font-size: 20px;
    `;

    const { item } = this.props;
    const { word, sound } = item;
    console.log(item);
    return <div className={styles.item}>
      <div className={styles.card}>
      <ReactFuri
        word={word}
        reading={sound[0].ja}
        className={styles.card}
        render={({ pairs }) => (
          <MyWrapper lang="ja">
            {pairs.map(([furigana, text], index) => (
              <MyFuriPair key={index}>
                <MyFuriText>{furigana}</MyFuriText>
                <MyFuriFury>{text}</MyFuriFury>
              </MyFuriPair>
            ))}
          </MyWrapper>
        )}>
      </ReactFuri>
      <div className={styles.mean}>
        {this.getMean()}
      </div>
      </div>
    </div>;
  }

}
