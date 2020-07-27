import React from 'react';
import Home from '../pages/Home';
import Exercise from '../pages/Exercise';
import Result from '../pages/Result';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Upload from '../pages/Upload';

function Root() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/exercise/:id" component={Exercise} />
        <Route path="/result" component={Result} />
        <Route path="/upload" component={Upload} />
        <Redirect path="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default Root;
