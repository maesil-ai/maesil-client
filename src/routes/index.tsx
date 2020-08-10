import React, { Dispatch } from 'react';
import Home from 'pages/Home';
import Exercise from 'pages/Exercise';
import Result from 'pages/Result';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Upload from 'pages/Upload';
import Signup from 'pages/Signup';
import Mypage from 'pages/Mypage';
import Logout from 'pages/Logout';
import Userpage from 'pages/User';

const Root = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/exercise/:id" component={Exercise} />
        <Route path="/result" component={Result} />
        <Route path="/upload" component={Upload} />
        <Route path="/signup" component={Signup} />
        <Route path="/mypage" component={Mypage} />
        <Route path="/logout" component={Logout} />
        <Route path="/user/:name" component={Userpage} />
        <Redirect path="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default Root;
