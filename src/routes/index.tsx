import React from 'react';
import Home from '../pages/Home';
import Exercise from '../pages/Exercise';
import Result from '../pages/Result';
import Playground from '../pages/Playground';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

const Root: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/exercise/:id" component={Exercise} />
      <Route path="/result" component={Result} />
      <Route path="/playground" component={Playground} />
      <Redirect path="*" to="/" />
    </Switch>
  </BrowserRouter>
);

export default Root;
