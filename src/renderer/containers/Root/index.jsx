import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedApp } from 'renderer/containers/App';
import { ConnectedLearn } from 'renderer/containers/Learn';
import { ConnectedCard } from 'renderer/containers/Card';
import './styles.css';

export const Root = () => (
  <Switch>
    <Route exact={true} path="/" component={ConnectedApp} />
    <Route exact={true} path="/dictionary" component={ConnectedLearn} />
    <Route exact={true} path="/card" component={ConnectedCard} />
    <Route path="*" component={ConnectedApp} />
  </Switch>
);
