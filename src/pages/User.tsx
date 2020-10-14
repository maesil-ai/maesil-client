import React, { useEffect } from 'react';

import Title from 'components/Title';
import Header from 'components/Header';
import Footer from 'components/Footer';
import {
  getAccessToken,
  getUserInfo,
  getLikes,
  getExercises,
  getChannel,
  getId,
} from 'utility/api';
import {
  APIGetUserInfoData,
  ContentData,
} from 'utility/types';
import Loading from 'pages/Loading';
import Shelf from 'components/Shelf';
import UserIntroduce from 'components/UserIntroduce';
import { useSelector } from 'react-redux';
import { RootReducerState } from 'reducers';
import { match } from 'react-router-dom';

interface MatchParams {
  name: string;
};

interface UserpageProps {
  match: match<MatchParams>;
}

function Userpage({ match }: UserpageProps) {
  let [name, setName] = React.useState<string>(match.params.name);
  let [id, setId] = React.useState<number>();
  let [exercises, setExercises] = React.useState<ContentData[]>();
  let [isLoading, setLoading] = React.useState<boolean>(true);
  let myUserInfo = useSelector((state : RootReducerState) => state.user.userInfo );

  useEffect(() => {
    let ok = 1;
    getId(name).then((id) => {
      setId(id);
      getChannel(id).then((exerciseData) => {
        if (!ok) return;
        setExercises(exerciseData);
        setLoading(false);
      });
    })
    
    return () => {
      ok = 0;
    };
  }, []);

  if (isLoading) return <Loading />;
  else
    return (
      <>
        <Header />
        <UserIntroduce name={name} id={id} />
        <Shelf title={`${name}님이 올린 영상들`} contents={exercises} control={ myUserInfo?.nickname == name ? "remove" : null } />
        <Footer />
      </>
    );
}

export default Userpage;
