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

import { getUserInfo, getSubscribes, getAccessToken } from 'utility/api';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { UserAction, setUser, clearUser } from 'actions';
import Modify from 'pages/Modify';
import Course from 'pages/Course';
import Fuck from 'pages/AccessToken';
import Loading from 'pages/Loading';
import { RootReducerState } from 'reducers';
import Error from 'pages/Error';


const Root = () => {
  const dispatch = useDispatch<Dispatch<UserAction>>();
  const system = useSelector((state: RootReducerState) => state.system);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getAccessToken().then((token) => {
      if (!token) {
        setLoading(false);
        return;
      }
      Promise.all([getUserInfo(), getSubscribes()]).then(([userInfo, subscribes]) => {
        if (userInfo && subscribes) {
          dispatch(setUser(userInfo, subscribes, null));
        } else {
          dispatch(clearUser());
        }
        setLoading(false);
      });
    });
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        { system.error && <Route path="*" component={Error} /> }
        { loading && <Route path="*" component={Loading} /> }
        <Route exact path="/" component={Home} />
        <Route path="/exercise/:id" component={Exercise} />
        <Route path="/result" component={Result} />
        <Route path="/upload" component={Upload} />
        <Route path="/signup" component={Signup} />
        <Route path="/mypage" component={Mypage} />
        <Route path="/happy" component={Course} />
        <Route path="/logout" component={Logout} />
        <Route path="/user/:name" component={Userpage} />
        <Route path="/setting/info" component={Modify} />
        <Route path="/fuck" component={Fuck} />
        <Redirect path="/setting/*" to="/setting/info" />
        <Redirect path="/setting" to="/setting/info" />
        <Redirect path="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default Root;
