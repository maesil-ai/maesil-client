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

import { getUserInfo } from 'utility/api';
import { SET_USER, CLEAR_USER } from 'actions/ActionTypes';
import { useDispatch } from 'react-redux';
import { UserAction } from 'actions';
import Modify from 'pages/Modify';


const Root = () => {
  const dispatch = useDispatch<Dispatch<UserAction>>();
  React.useEffect(() => {
    getUserInfo().then((data) => {
      if (data) {
        dispatch({
          type: SET_USER,
          userInfo: data,
        });
      } else {
        dispatch({
          type: CLEAR_USER,
        });
      }
    });
  }, []);

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
        <Route path="/setting/info" component={Modify} />
        <Redirect path="/setting/*" to="/setting/info" />
        <Redirect path="/setting" to="/setting/info" />
        <Redirect path="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default Root;
