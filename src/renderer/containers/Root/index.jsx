import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedLearn } from 'renderer/containers/Learn';
import { ConnectedCard } from 'renderer/containers/Card';
import './styles.css';
import { ConnectedApp } from 'renderer/containers/App';
import { ConnectedTest } from 'renderer/containers/Test';

export const Root = () => (
  <Switch>
    <Route exact path="/" component={ConnectedApp} />
    <Route exact path="/dictionary" component={ConnectedLearn} />
    <Route exact path="/card" component={ConnectedCard} />
    <Route exact path="/test" component={ConnectedTest} />
    <Route path="*" component={ConnectedApp} />
  </Switch>
);

export default { Root };
