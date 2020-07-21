import apiAddress from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Title from '../components/Title';
import StatView from '../components/StatView';
import Loading from '../components/Loading';

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
    };
  }

  componentDidMount = () => {
    axios({
      method: 'GET',
      url: apiAddress + '/exercises/' + this.state.exerciseId,
    }).then((response) => {
      const exerciseName = response.data.result.title;

      this.setState({
        ...this.state,
        loading: false,
        exerciseName: exerciseName,
      });
    }).catch((error) => {
      console.log('ㅋㅋ');
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
              다음 코스도 추천해 주자~
          <Footer/>
        </>
      );
    }
  }
};

export default Result;
