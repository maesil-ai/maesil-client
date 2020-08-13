import { getExercises, getExercise } from 'utility/api';

import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Title from 'components/Title';
import StatView from 'components/StatView';
import Loading from 'pages/Loading';

import Shelf from 'components/Shelf';
import { ContentData, PlayRecord } from 'utility/types';

interface ResultProps {
  exerciseId: number;
  location: any;
}

interface ResultState {
  loading: boolean;
  exerciseId: number;
  exerciseName?: string;
  stats: PlayRecord;
  nextExercises: ContentData[];
}

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
    const [exercise, exercises] = await Promise.all([
      getExercise(this.state.exerciseId),
      getExercises(),
    ]);

    this.setState({
      ...this.state,
      nextExercises: exercises,
      exerciseName: exercise.name,
      loading: false,
    });
  }

  render() {
    if (this.state.loading) return <Loading />;
    else {
      const stats = this.state.stats;

      return (
        <>
          <Header />
          <Title title={this.state.exerciseName + ' 완료!'} />
          <StatView
            time={stats.time}
            calorie={stats.calorie}
            score={stats.score}
          />
          <Shelf title="다음에 할 운동들" exercises={this.state.nextExercises} />
          <Footer />
        </>
      );
    }
  }
}

export default Result;
