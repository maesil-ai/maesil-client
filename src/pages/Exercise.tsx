import apiAddress from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {Redirect} from 'react-router-dom';

interface ExerciseProps {
    match: any,
    history?: any,
};

interface ExerciseState {
    isLoading: boolean,
    isFinished: boolean,
    redirectToResult: boolean,
    id: number,
    url?: string,
    score: number,
    time: number,
    calorie: number,
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
 * @extends {React.Component<ExerciseProps, ExerciseState>}
 */
class Exercise extends React.Component<ExerciseProps, ExerciseState> {
    guideVideo = React.createRef<HTMLVideoElement>();
    userVideo = React.createRef<HTMLVideoElement>();
    videoWidth = 800;
    videoHeight = 600;

    /**
     * Creates an instance of Exercise.
     * @param {ExerciseProps} props
     * @memberof Exercise
     */
    constructor(props : ExerciseProps) {
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


    /**
     * id로 서버에 비디오를 요청해서 url을 받아옴
     * @param {number} id
     * @return {*} 비디오의 url
     */
    loadVideo = async (id : number) => {
      const response = await axios.get(apiAddress + '/exercises/' + id);
      return response.data.result.video_url;
    }

    loadStream = async () => {
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: this.videoWidth,
          height: this.videoHeight,
        },
      });
    }

    componentDidMount = () => {
      const guideSource = this.loadVideo(this.state.id);
      const userStream = this.loadStream();

      Promise.all([guideSource, userStream]).
          then(([guideSource, userStream]) => {
            const guideVideo = this.guideVideo.current!;
            const userVideo = this.userVideo.current!;
            guideVideo.src = guideSource;
            guideVideo.play();
            userVideo.srcObject = userStream;
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
    onExerciseFinish = (data) => {
      axios.post(apiAddress + '/exercises/' + this.state.id + '/history', {
        'score': this.state.score,
        'play_time': timeToString(this.state.time),
        'cal': this.state.calorie,
      }).then((response) => {
        // response.data.code != 200이면?
        console.log(response);
        if (response.data.code === 200) {
          this.setState({
            ...this.state,
            redirectToResult: true,
          });
        }
      }).catch((error) => {

      });
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
            height={this.videoHeight}
            width={this.videoWidth}
            crossOrigin={'anonymous'}
            style={{display: 'none'}}
            ref={this.guideVideo}
          />
          <video
            height={this.videoHeight}
            width={this.videoWidth}
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
                운동 불러오는 중...
            <Footer/>
          </div>
        );
      } else {
        return (
          <div>
            <Header/>
            { videos }
            <Screen
              videoWidth = { this.videoWidth }
              videoHeight = { this.videoHeight }
              views = {[
                { // Guide View
                  video: this.guideVideo.current!,
                  scale: 1,
                  offset: [0, 0],
                },
                { // User View
                  video: this.userVideo.current!,
                  scale: 0.4,
                  offset: [100, 100],
                },
              ]}
            />
            <button onClick={ this.onExerciseFinish }>
                    그냥 결과창 보내기
            </button>
            <Footer/>
          </div>
        );
      }
    }
};

export default Exercise;
