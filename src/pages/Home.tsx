import { getExercises } from '../utility/api';

import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Title from '../components/Title';
import Loading from '../components/Loading';
import Shelf, { Exercise } from '../components/Shelf';

interface ShelfData {
  title: string,
  exercises: Exercise[],
};

interface HomeProps {

};

interface HomeState {
    shelfDatas: ShelfData[],
    loading: boolean,
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
      shelfDatas: [],
      loading: true,
    };
  }

  /**
   * 기본 함수
   * @memberof Home
   */
  async componentDidMount() {
    const defaultImageUrl = 'https://maesil-storage.s3.ap-northeast-2.amazonaws.com/images/boyunImage.jpg';
    const defaultGifImageUrl = 'https://thumbs.gfycat.com/AdmiredTangibleBeardedcollie-size_restricted.gif';

    const exerciseData = await getExercises();
    const exercises : Exercise[] = exerciseData.map((data) => ({
      id: data.exercise_id,
      name: data.title,
      thumbUrl: data.thumb_url ? data.thumb_url : defaultImageUrl,
      thumbGifUrl: defaultGifImageUrl,
      playTime: data.play_time,
    }));

    this.setState({
      ...this.state,
      shelfDatas: [
        {
          title: "그냥... 모든 운동들",
          exercises: exercises,
        }, {
          title: "첫글자 P로 시작하는 운동들!",
          exercises: exercises.filter((exercise) => { return (exercise.name[0] === 'p' || exercise.name[0] === 'P'); })
        },
      ],
      loading: false,
    });
  }

  render() {
  if (this.state.loading) return (
    <>
      <Header/>
      <Loading/>
      <Footer/>
    </>
  );
  else {
    const shelfs = this.state.shelfDatas.map((data) => (
      <div key={data.title}>
        <Title title = { data.title }/>
        <Shelf exercises = { data.exercises }/>
      </div>
    ));
    
    return (
      <>
        <Header/>
        { shelfs }
        <Footer/>
      </>
    );
  }
}

};

export default Home;
