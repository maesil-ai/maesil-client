import { getExercises, getCourses } from 'utility/api';

import React from 'react';

import Header from 'components/Header';
import Footer from 'components/Footer';
import Title from 'components/Title';
import Loading from 'pages/Loading';
import Shelf from 'components/Shelf';
import { ContentData } from 'utility/types';
import store from 'store';
import { Link } from 'react-router-dom';

interface ShelfData {
  title: string;
  contents: ContentData[];
}

interface HomeProps {}

interface HomeState {
  shelfDatas: ShelfData[];
  contentDatas: ContentData[];
  loading: boolean;
}

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
  constructor(props: HomeProps) {
    super(props);
    this.state = {
      shelfDatas: [],
      loading: true,
      contentDatas: [],
    };
  }

  /**
   * 기본 함수
   * @memberof Home
   */
  async componentDidMount() {
    const exercises = await getExercises();
    const courses = await getCourses();

    console.log(exercises);
    
    this.setState({
      ...this.state,
      shelfDatas: [
        {
          title: '모든 운동들',
          contents: exercises,
        },
        {
          title: '모든 운동 코스들',
          contents: courses,
        },
      ],
      loading: false,
      contentDatas: exercises.concat(courses),
    });
  }

  render() {
    if (this.state.loading) return <Loading/>;
    else {
      const shelfs = this.state.shelfDatas.map((data, index) => (
        <Shelf key={index} title={data.title} contents={data.contents} control={store.getState().user.loggedIn ? "heart" : null} />
      ));

      return (
        <>
          <Header />
          <div style={{marginBottom: '-32px'}} />
          <div style={{height: '360px', background: '#1E1A14'}} >
            <img style={{position: 'absolute', left: '166px'}} src='https://maesil-storage.s3.ap-northeast-2.amazonaws.com/main.png' />
            <div style={{position: 'absolute', left: '55%', top: '64px', color: 'white', fontWeight: 'bold', fontSize: '36px'}}>
              매일매일 실내 트레이닝
            </div>
            <div style={{position: 'absolute', left: '55%', top: '132px', color: 'white', fontWeight: 'normal', fontSize: '18px', opacity: '0.6', lineHeight: '27px'}}>
              누구나 운동을 만들고 트레이닝할 수 있는 
              <br/>
              새로운 실내 헬스 트레이닝 플랫폼
            </div>
            <Link to='/studio'>
              <div style={{position: 'absolute', left: '55%', top: '240px'}} className='neonbox' >
                MAESIL STUDIO
              </div>
            </Link>
          </div>
          {shelfs}
          <Footer />
        </>
      );
    }
  }
}

export default Home;
