import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { seedrandom } from 'seedrandom';
import { BaseContainer, mapDispatchToProps, mapStateToProps, } from 'renderer/containers/Base';
import { Button } from 'renderer/components/Button';
import { ProblemItem } from 'renderer/components/ProblemItem';
import { TopBar } from 'renderer/containers/TopBar';
import * as styles from './styles.css';

export class Test extends BaseContainer {
  constructor(props, context) {
    super(props, context);

    const words = this.getWordAccessor().getWords();
    const maxCount = 100;
    const problems = [];
    const check = {};
    const seed = parseInt(Date.now() / (1000 * 60), 10);
    Math.seedrandom(seed);
    while (true) {
      const idx = parseInt(Math.random() * 100000000, 10) % words.length;
      if (idx >= 0 && !check[idx]) {
        problems.push(words[idx]);
        check[idx] = true;
      }
      if (problems.length >= maxCount) {
        break;
      }
    }

    const answers = [];
    for (let i = 0; i < maxCount; i += 1) {
      answers.push({});
    }
    this.answers = answers;

    this.state = {
      seed,
      problems,
      score: 0,
      scorecard: [],
      isSubmit: false,
    };
  }

  marking() {
    const scorecard = [];
    const { problems } = this.state;
    const normalize = string => string.replace(/\s/g, '');
    this.answers.forEach((answer, idx) => {
      const problem = problems[idx];
      const score = { reading: false, meaning: false };
      if (answer.reading) {
        score.reading = problem.readings.find(
          reading => normalize(answer.reading) === normalize(reading),
        ) !== undefined;
      }
      if (answer.meaning) {
        score.meaning = problem.meanings.find(
          meaning => normalize(answer.meaning) === normalize(meaning),
        ) !== undefined;
      }
      scorecard.push(score);
    });
    this.setState({
      isSubmit: true,
      scorecard,
      score:
        (scorecard
          .map(score => (score.reading << 0) + (score.meaning << 0))
          .reduce((s1, s2) => s1 + s2, 0)
          / (problems.length * 2))
        * 100,
    });
  }

  makeProblemItemProps(problem, idx) {
    const props = {
      key: `ProblemItem_${problem.hash}`,
      num: idx + 1,
      problem,
      onChangeValue: (num, answer) => {
        this.answers[num - 1] = answer;
      },
    };
    const score = this.state.scorecard[idx];
    if (score) {
      return { ...props, score };
    }
    return props;
  }

  render() {
    const { history } = this.props;
    const {
      isSubmit, score, seed, problems,
    } = this.state;
    return (
      <>
        <TopBar
          title={`Test - (${seed})`}
          onBack={() => {
            history.goBack();
          }}
        />
        <div className={styles.body}>
          <ul className={styles.list}>
            {problems.map((problem, idx) => (
              <ProblemItem {...this.makeProblemItemProps(problem, idx)} />
            ))}
          </ul>
          <div className={styles.footer}>
            {isSubmit ? (
              <div>
                <div className={styles.score}>
                  {score}
                  점
                </div>
                <Button
                  label="확인 완료"
                  onClick={() => {
                    history.goBack();
                  }}
                />
              </div>
            ) : (
              <Button
                label="제출"
                onClick={() => {
                  this.marking();
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

export const ConnectedTest = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { pure: false },
  )(Test),
);
