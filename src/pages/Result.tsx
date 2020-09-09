import { getExercises, getExercise } from 'utility/api';

import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Title from 'components/Title';
import StatView from 'components/StatView';
import Loading from 'pages/Loading';

import Shelf from 'components/Shelf';
import { ContentData, PlayRecord } from 'utility/types';
import usePromise from 'utility/usePromise';
import { RootReducerState } from 'reducers';
import { useSelector } from 'react-redux';

function Result() {
  let [loading, nextExercises] = usePromise(getExercises);
  let {content, record} = useSelector((state : RootReducerState) => state.content );


  if (loading) return <Loading />;
  else return (
    <>
      <Header />
      <Title title={content.name + ' 완료!'} />
      <StatView
        time={record.playTime}
        calorie={record.calorie}
        score={record.score}
      />
      <Shelf title="다음에 할 운동들" exercises={nextExercises} />
      <Footer />
    </>
  )
}

export default Result;
