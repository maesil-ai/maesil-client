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
} from 'utility/api';
import {
  APIGetUserInfoData,
  ExerciseData,
} from 'utility/types';
import Loading from 'components/Loading';
import Shelf from 'components/Shelf';

interface UserpageProps {
  match?: any;
}

function Userpage({ match }: UserpageProps) {
  const nickname = match.params.name;
  let [exercises, setExercises] = React.useState<ExerciseData[]>();
  let [isLoading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    let ok = 1;
    getChannel(nickname).then((exerciseData) => {
      if (!ok) return;
      setExercises(
        exerciseData
      );
      setLoading(false);
    });
    return () => {
      ok = 0;
    };
  }, []);

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
        <Title title={nickname + '님이 올린 영상입니다.'} />
        <Shelf exercises={exercises} control="remove" />
        <Footer />
      </>
    );
}

export default Userpage;
