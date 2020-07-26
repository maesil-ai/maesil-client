import apiAddress from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Title from '../components/Title';
import StatView from '../components/StatView';
import Loading from '../components/Loading';

import Shelf, { Exercise } from '../components/Shelf';

interface Stats {
    time: number,
    calorie: number,
    score: number,
};

interface ResultProps {
    exerciseId : number,
    location: any,
};

interface ResultState {
    loading : boolean,
    exerciseId : number,
    exerciseName? : string,
    stats: Stats,
    nextExercises: Exercise[],
};

/**
 * Result 페이지
 * @class Result
 * @extends {React.Component<ResultProps, ResultState>}
 */
class Result extends React.Component<ResultProps, ResultState> {

  /**
   *Creates an instance of Result.
    * @param {*} props
    * @memberof Result
    */
  constructor(props) {
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


  loadExercises = async () => {
    let response = await axios.get(
        apiAddress + '/exercises/'
    );
    return response;
  }

  loadExercise = async (id: number) => {
    let response = await axios.get(
      apiAddress + '/exercises/' + id
    );
    return response;
  }

  async componentDidMount() {
    const [responseExercise, responseExercises] = await Promise.all([
      this.loadExercise(this.state.exerciseId),
      this.loadExercises(),
    ]);

    const exerciseName = responseExercise.data.result.title;

    const exerciseData = responseExercises.data.result;
    const exercises : Exercise[] = [];
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

  /**
   * result페이지를 렌더링 하는 함순
   * @return {any} 렌더링 될 HTML
   * @memberof Result
   */
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
      let stats = this.state.stats;

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
