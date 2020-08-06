import { getExercises, getExercise } from 'utility/api';

import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Title from 'components/Title';
import StatView from 'components/StatView';
import Loading from 'components/Loading';

import Shelf from 'components/Shelf';
import { ExerciseView, PlayRecord } from 'utility/types';

interface ResultProps {
    exerciseId : number,
    location: any,
};

interface ResultState {
    loading : boolean,
    exerciseId : number,
    exerciseName? : string,
    stats: PlayRecord,
    nextExercises: ExerciseView[],
};

/**
 * Result 페이지
 * @class Result
 * @extends {React.Component<ResultProps, ResultState>}
 */
class Result extends React.Component<ResultProps, ResultState> {

  constructor(props: Readonly<ResultProps>) {
    super(props);

    this.state = {
      loading: true,
      exerciseId: this.props.location.state.exerciseId,
      stats: {
        time: this.props.location.state.time,
        calorie: this.props.location.state.calorie,
        score: this.props.location.state.score,
      },
      nextExercises: [],
    };
  }
  async componentDidMount() {
    const [responseExercise, responseExercises] = await Promise.all([
      getExercise(this.state.exerciseId),
      getExercises(),
    ]);

    const exerciseName = responseExercise.title;

    const exerciseData = responseExercises;
    const exercises : ExerciseView[] = [];
    for (const exercise of exerciseData) {
      exercises.push({
        id: exercise.exercise_id,
        name: exercise.title,
        thumbUrl: exercise.thumb_url ? exercise.thumb_url : 'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/images/boyunImage.jpg',
        playTime: exercise.play_time,
      });
    };

    this.setState({
      ...this.state,
      nextExercises: exercises,
      exerciseName: exerciseName,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <>
          <Header/>
          <Loading/>
          <Footer/>
        </>
      );
    } else {
      const stats = this.state.stats;

      return (
        <>
          <Header/>
          <Title title={ this.state.exerciseName + ' 완료!' } />
          <StatView time={ stats.time }
            calorie={ stats.calorie }
            score={ stats.score } />
          <Title title={"다음에 할 운동들"} />
          <Shelf exercises={this.state.nextExercises} />
          <Footer/>
        </>
      );
    }
  }
};

export default Result;
