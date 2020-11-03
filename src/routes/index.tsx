import React, { Dispatch } from 'react';
import Home from 'pages/Home';
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
import { UserAction, setUser, clearUser, SystemAction, setTagsData } from 'actions';
import SettingInfo from 'pages/SettingInfo';
import Content from 'pages/Content';
import Fuck from 'pages/AccessToken';
import Loading from 'pages/Loading';
import { RootReducerState } from 'reducers';
import Error from 'pages/Error';
import UploadCourse from 'pages/UploadCourse';
import { userInfoHasMetadata } from 'utility/types';
import usePromise from 'utility/usePromise';
import HitTest from 'pages/HitTest';
import Test3D from 'pages/Test3D';
import ContentList from 'pages/ContentList';
import MypageRecord from 'pages/MypageRecord';
import Tutorial from 'pages/Tutorial';
import Hello from 'pages/Hello';


const Root = () => {
  const dispatch = useDispatch<Dispatch<UserAction | SystemAction>>();
  const system = useSelector((state: RootReducerState) => state.system);
  const user = useSelector((state: RootReducerState) => state.user);
  const [userInfoLoading, userInfo] = usePromise(getUserInfo);
  const [subscribesLoading, subscribes] = usePromise(getSubscribes);
  const [tagsLoading, tags] = usePromise(getTags);

  React.useEffect(() => {
    if (userInfo) dispatch(setUser(userInfo, subscribes, null));
    else dispatch(clearUser());
    dispatch(setTagsData(tags));
  }, [userInfo, subscribes, tags]);

  return (
    <BrowserRouter>
      <Analytics id="UA-178106844-1" debug>
        <Switch>
          { system.error && <Route path="*" component={Error} /> }
          { (userInfoLoading || subscribesLoading || tagsLoading) && <Route path="*" component={() => <Loading headerReal={false}/> } /> }
          <Route path="/logout" component={Logout} />
          { user.loggedIn && !userInfoHasMetadata(user.userInfo) && <Route path="*" component={Signup} /> }
          <Route path="/exercise/:id" component={Content} />
          <Route path="/course/:id" component={Content} />
          <Route path="/result" component={Result} />
          <Redirect path="/upload/course" to="/studio/course" />
          <Redirect path="/upload/*" to="/studio/exercise" />
          <Redirect path="/upload" to="/studio/exercise" />
          <Route path="/studio/exercise" component={UploadExercise} />
          <Route path="/studio/course" component={UploadCourse} />
          <Redirect path="/studio/*" to="/studio/exercise" />
          <Redirect path="/studio" to="/studio/exercise" />
          <Route path="/signup" component={Signup} />
          <Route path="/mypage/info" component={Mypage} />
          <Route path="/mypage/record" component={MypageRecord} />
          <Redirect path="/mypage/*" to="mypage/info" />
          <Redirect path="/mypage" to="mypage/info" />
          <Route path="/user/:name" component={Userpage} />
          <Route path="/setting/info" component={SettingInfo} />
          <Redirect path="/setting/*" to="/setting/info" />
          <Redirect path="/setting" to="/setting/info" />
          <Route path="/fuck" component={Fuck} />
          <Route path="/justload" component={Loading} />
          <Route path="/justerror" component={Error} />
          <Route path="/hittest" component={HitTest} />
          <Route path="/3dtest" component={Test3D} />
          <Route path="/search/:query" component={ContentList} />
          <Route path="/tag/:tag" component={ContentList} />
          <Redirect path="/test3d" to="/3dtest" />
          <Route path="/:remark" component={Home} />
          { !user.userInfo && <Route path="/" component={Hello} /> }
          <Route path="/" component={Home} />
          <Redirect path="*" to="/" />
        </Switch>
      </Analytics>
    </BrowserRouter>
  );
}

export default Root;
