import React from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { getAccessToken, getUserInfo, getLikes } from 'utility/api';
import { APIGetUserInfoData, ExerciseData } from 'utility/types';
import Loading from 'components/Loading';
import { Redirect } from 'react-router-dom';
import Shelf from 'components/Shelf';

function Mypage() {
  let [userInfo, setUserInfo] = React.useState<APIGetUserInfoData>();
  let [isLoading, setLoading] = React.useState<boolean>(true);
  let [likes, setLikes] = React.useState<ExerciseData[]>([]);

  React.useEffect(() => {
    Promise.all([getUserInfo(), getLikes()]).then(([info, likes]) => {
      setUserInfo(info);

      setLikes(likes);
      setLoading(false);
    });
  }, []);

  if (!getAccessToken()) return <Redirect to="/" />;
  if (isLoading)
    return (
      <>
        <Header />
        <Loading />
        <Footer />
      </>
    );
  else
    return (
      <>
        <Header />
        <Title title={userInfo.nickname + '님, 오늘도 파이팅!'} />
        <div className="zone">
          <div> 현재 {userInfo.level}레벨입니다. </div>
          <div> 키: {userInfo.height}cm </div>
          <div> 몸무게: {userInfo.weight}kg </div>
          <div> 성별: {userInfo.gender} </div>
        </div>
        <Shelf title={`${userInfo.nickname}님이 좋아하는 운동들`} exercises={likes} />
        <Footer />
      </>
    );
}

export default Mypage;
