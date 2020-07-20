import apiAddress from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {Redirect} from 'react-router-dom';

interface PlaygroundProps {
  videoWidth: number,
  videoHeight: number,
  match?: any,
  history?: any,
};

interface PlaygroundState {
    isLoading: boolean,
    isFinished: boolean,
    redirectToResult: boolean,

    id: number,

    score: number,
    time: number,
    calorie: number,

    url?: string,
};

/**
 * 시간(숫자)을 string으로 변환하는 함수
 * @param {number} time
 * @return {string} 시간을 DB에 저장하기 좋게 string으로 변환
 */
function timeToString(time : number) {
  const sec0 = time % 10;
  time = (time - sec0) / 10;
  const sec1 = time % 6;
  time = (time - sec1) / 6;
  const min0 = time % 10;
  time = (time - min0) / 10;
  const min1 = time % 6;
  time = (time - min1) / 6;
  const hr0 = time % 10;
  time = (time - hr0) / 10;
  const hr1 = time % 10;

  return `${hr1}${hr0}:${min1}${min0}:${sec1}${sec0}`;
}

/**
 * Excerciese 페이지
 * @class Exercise
 * @extends {React.Component<PlaygroundProps, PlaygroundState>}
 */
class Playground extends React.Component<PlaygroundProps, PlaygroundState> {
  guideVideo = React.createRef<HTMLVideoElement>();
  userVideo = React.createRef<HTMLVideoElement>();
  path1 = "";
  path2 = "";
  
  static defaultProps = {
    videoWidth: 800,
    videoHeight: 600,
  };

  /**
   * Creates an instance of Exercise.
   * @param {PlaygroundProps} props
   * @memberof Exercise
   */
  constructor(props : PlaygroundProps) {
    super(props);

    this.state = {
      isLoading: true,
      isFinished: false,
      redirectToResult: false,
      id: props.match.params.id,
      score: 10.21,
      time: 63,
      calorie: 731,
    };
  }


  loadVideo = () => {
    const videoA = this.path1;
    const videoB = this.path2;

    Promise.all([videoA, videoB]).then(([videoA, videoB]) => {
          const guideVideo = this.guideVideo.current!;
          const userVideo = this.userVideo.current!;
          guideVideo.src = videoA;
          guideVideo.play();
          userVideo.src = videoB;
          userVideo.play();

          new Promise((resolve) => {
            let cnt = 0;
            const incrementCnt = () => {
              cnt += 1;
              if (cnt >= 2) resolve();
            };
            guideVideo.onloadeddata = incrementCnt;
            userVideo.onloadeddata = incrementCnt;
          }).then(() => this.setState({
            ...this.state,
            isLoading: false,
          }));
        });
  };

  /**
   * 운동이 끝날때 실행될 함수
   * @param {*} data 넘겨줄 데이터
   * @memberof Exercise
   */
  handleExerciseFinish = (data) => {
    axios.post(apiAddress + '/exercises/' + this.state.id + '/history', {
      'score': this.state.score,
      'play_time': timeToString(this.state.time),
      'cal': this.state.calorie,
    }).then((response) => {
      // response.data.code != 200이면?
      if (response.data.code === 200) {
        this.setState({
          ...this.state,
          redirectToResult: true,
        });
      } else {
        console.log('ㅋㅋ..;;');
      }
    }).catch((error) => {
      console.log('ㅋㅋ..ㅈㅅ!!ㅎㅎ..');
    });
  }

  onChange1 = (e) => {
    this.path1 = e.target.value;
  }

  onChange2 = (e) => {
    this.path2 = e.target.value;
  }

  onButtonClick = (e) => {
    this.loadVideo();
  }

  /**
   * 운동 페이지를 렌더링 해서 보여줌
   * @return {any} 운동 페이지 HTML
   * @memberof Exercise
   */
  render() {
    if (this.state.redirectToResult) {
      return <Redirect push to={{
        pathname: '/result',
        state: {
          score: this.state.score,
          time: this.state.time,
          calorie: this.state.calorie,
        },
      }}/>;
    }
    const videos = (
      <div>
        <video
          height={this.props.videoHeight}
          width={this.props.videoWidth}
          crossOrigin={'anonymous'}
          style={{display: 'none'}}
          onEnded={this.handleExerciseFinish}
          ref={this.guideVideo}
        />
        <video
          height={this.props.videoHeight}
          width={this.props.videoWidth}
          crossOrigin={'anonymous'}
          style={{display: 'none'}}
          ref={this.userVideo}
        />
      </div>
    );

    if (this.state.isLoading) {
      return (
        <div>
          <Header/>
          { videos }
            <input onChange={this.onChange1} placeholder={"첫번째 영상 경로"} />
            <input onChange={this.onChange2} placeholder={"두번째 영상 경로"} />
            <button onClick={this.onButtonClick}>실행!!!</button>
          <Footer/>
        </div>
      );
    } else {
      return (
        <div>
          <Header/>
          { videos }
          <Screen
            videoWidth = { this.props.videoWidth }
            videoHeight = { this.props.videoHeight }
            views = {[
              { // Guide View
                video: this.guideVideo.current!,
                scale: 1,
                offset: [0, 0],
              },
              { // User View
                video: this.userVideo.current!,
                scale: 0.3,
                offset: [540, 400],
              },
            ]}
          />
          <button onClick={ this.handleExerciseFinish }>
            그냥 결과창 보내기
          </button>
          <Footer/>
        </div>
      );
    }
  }
};

export default Playground;
