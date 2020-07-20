import apiAddress from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';
import {Link} from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface HomeProps {

};

interface exercise {
    id: number,
    url: string,
};

interface HomeState {
    exercises: exercise[],
    select: number,
};

class Home extends React.Component<HomeProps, HomeState> {
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
        const exercises : exercise[] = [{
          id: -1,
          url: '눌러서 선택해주세요~~',
        }];
        for (const exercise of exerciseData) {
          exercises.push({
            id: exercise.exercise_id,
            url: exercise.video_url,
          });
        }
        this.setState({
          ...this.state,
          exercises: exercises,
        });
      }).catch((error) => {

      });
    }

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

    render() {
      const options = this.state.exercises.map(({id, url}, key) => (<option value={id} key={key}>{url}</option>));
      return (
        <div>
          <Header/>
          <select onChange = { this.onItemSelect }>
            { options }
          </select>
          <Link to={'/exercise/' + (this.state.select === -1 ? '' : this.state.select)}>
            <button>
                        Pose estimation.. 해볼래?
            </button>
          </Link>
          <Footer/>
        </div>
      );
    }
};

export default Home;
