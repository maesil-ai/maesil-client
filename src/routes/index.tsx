import React, { Dispatch } from 'react';
import Home from 'pages/Home';
import Exercise from 'pages/Exercise';
import Result from 'pages/Result';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Analytics from 'react-router-ga';
import UploadExercise from 'pages/UploadExercise';
import Signup from 'pages/Signup';
import Mypage from 'pages/Mypage';
import Logout from 'pages/Logout';
import Userpage from 'pages/User';

import { getUserInfo, getSubscribes, getAccessToken, getTags } from 'utility/api';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { UserAction, setUser, clearUser, setTags, SystemAction } from 'actions';
import Modify from 'pages/Modify';
import Course from 'pages/Course';
import Fuck from 'pages/AccessToken';
import Loading from 'pages/Loading';
import { RootReducerState } from 'reducers';
import Error from 'pages/Error';
import UploadCourse from 'pages/UploadCourse';
import { userInfoHasMetadata } from 'utility/types';
import usePromise from 'utility/usePromise';


const Root = () => {
  const dispatch = useDispatch<Dispatch<UserAction | SystemAction>>();
  const system = useSelector((state: RootReducerState) => state.system);
  const user = useSelector((state: RootReducerState) => state.user);
  const [userInfoLoading, userInfo] = usePromise(getUserInfo);
  const [subscribesLoading, subscribes] = usePromise(getSubscribes);
  const [tagsLoading, tags] = usePromise(getTags);

  React.useEffect(() => {
    if (userInfo && subscribes) dispatch(setUser(userInfo, subscribes, null));
    else dispatch(clearUser());
  }, [userInfo, subscribes]);

  React.useEffect(() => {
    dispatch(setTags(tags));
  }, [tags]);

  return (
    <BrowserRouter>
      <Analytics id="UA-178106844-1" debug>
        <Switch>
          { system.error && <Route path="*" component={Error} /> }
          { (userInfoLoading || subscribesLoading || tagsLoading) && <Route path="*" component={() => <Loading headerReal={false}/> } /> }
          <Route path="/logout" component={Logout} />
          { user.loggedIn && !userInfoHasMetadata(user.userInfo) && <Route path="*" component={Signup} /> }
          <Route exact path="/" component={Home} />
          <Route path="/exercise/:id" component={Exercise} />
          <Route path="/course/:id" component={Course} />
          <Route path="/result" component={Result} />
          <Route path="/upload/exercise" component={UploadExercise} />
          <Route path="/upload/course" component={UploadCourse} />
          <Redirect path="/upload/*" to="/upload/exercise" />
          <Redirect path="/upload" to="/upload/exercise" />
          <Route path="/signup" component={Signup} />
          <Route path="/mypage/info" component={Mypage} />
          <Redirect path="/mypage/*" to="mypage/info" />
          <Redirect path="/mypage" to="mypage/info" />
          <Route path="/user/:name" component={Userpage} />
          <Route path="/setting/info" component={Modify} />
          <Redirect path="/setting/*" to="/setting/info" />
          <Redirect path="/setting" to="/setting/info" />
          <Route path="/fuck" component={Fuck} />
          <Redirect path="*" to="/" />
        </Switch>
      </Analytics>
    </BrowserRouter>
  );
}

export default Root;
