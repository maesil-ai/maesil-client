import apiAddress from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';
import {Link} from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Shelf, { Exercise } from '../components/Shelf';

interface HomeProps {

};

interface HomeState {
    exercises: Exercise[],
    select: number,
};

/**
 * 홈 클래스 (메인 화면, 추천 화면 담당) 페이지
 * @param {any} event
 * @class Home
 * @extends {React.Component<HomeProps, HomeState>}
 */
class Home extends React.Component<HomeProps, HomeState> {
  /**
   * Creates an instance of Home.
   * @param {HomeProps} props
   * @memberof Home
   */
  constructor(props : HomeProps) {
    super(props);
    this.state = {
      exercises: [],
      select: -1,
    };
  }

  loadExercises = async () => {
    axios.get(
        apiAddress + '/exercises/',
    ).then((response) => {
      const exerciseData = response.data.result;
      const exercises : Exercise[] = [];
      for (const exercise of exerciseData) {
        exercises.push({
          id: exercise.exercise_id,
          name: exercise.title,
          thumbUrl: exercise.thumb_url ? exercise.thumb_url : 'https://img.theqoo.net/img/gIevJ.jpg',
        });
      }
      this.setState({
        ...this.state,
        exercises: exercises,
      });
    }).catch((error) => {

    });
  }

  /**
   * 기본 함수
   * @memberof Home
   */
  componentDidMount() {
    this.loadExercises();
  }

  onItemSelect = (event : any) => {
    this.setState({
      ...this.state,
      select: event.target.value,
    });
    console.log(event.target.value);
  }

  /**
   * Home 페이지를 렌더링하는 함수
   * @return {any} 렌더될 HTML 코드
   * @memberof Home
   */
  /*
  render() {
    const options = this.state.exercises.map(({id, name, url}, key) =>
      (<option value={id} key={key}> {name} </option>));
    return (
      <div>
        <Header/>
        <select onChange = { this.onItemSelect }>
          { options }
        </select>
        <Link to={'/exercise/' +
          (this.state.select === -1 ? '' : this.state.select)}>
          <button>
                      Pose estimation.. 해볼래?
          </button>
        </Link>
        <Footer/>
      </div>
    );
  }
  */
 render() {
  return (
    <div>
      <Header/>
        <Shelf exercises = { this.state.exercises } />
      <Footer/>
    </div>
  );
}

};

export default Home;
