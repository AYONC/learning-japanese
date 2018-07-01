import * as React from 'react';
import ReactFuri from 'react-furi';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as styles from './styles.css';

export class WordItem extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
  };

  getMean() {
    return this.props.item.meanings.join(', ');
  }

  render() {
    const Wrapper = styled(ReactFuri.Wrapper)`
      width: 100%;
      display: block;
      font-family: Chig;
      text-align: center;
      vertical-align: middle;
    `;
    const Pair = styled(ReactFuri.Pair)`
      font-family: Chig;
    `;
    const Text = styled(ReactFuri.Text)`
      font-family: Chig;
      font-size: 20px;
    `;
    const Furi = styled(ReactFuri.Furi)`
      font-family: Chig;
      font-size: 70px;
    `;

    const { item } = this.props;
    const { word, readings, furi } = item;
    const props = { word };
    if (furi) {
      props.furi = furi;
    } else {
      props.reading = readings[0];
    }

    return (
      <div className={styles.item}>
        <div className={styles.card}>
          <ReactFuri
            className={styles.card}
            {...props}
            render={({ pairs }) => (
              <Wrapper lang="ja">
                {pairs.map(([furigana, text], index) => (
                  <Pair key={index}>
                    <Text>{furigana}</Text>
                    <Furi>{text}</Furi>
                  </Pair>
                ))}
              </Wrapper>
            )}
          />
          <div className={styles.mean}>{this.getMean()}</div>
        </div>
      </div>
    );
  }
}
