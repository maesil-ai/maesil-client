import apiAddress from '../secret';

// @ts-ignore
import axios from 'axios';
import React from 'react';
import Screen from '../components/Screen';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import {Redirect} from 'react-router-dom';

interface ExerciseProps {
  videoWidth: number,
  videoHeight: number,
  match?: any,
  history?: any,
};

interface Record {
  score: number,
  playTime: number,
  calorie: number,
};

interface ExerciseState {
  isLoading: boolean,
  isFinished: boolean,
  redirectToResult: boolean,

  id: number,

  record: Record | null,

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
 * @extends {React.Component<ExerciseProps, ExerciseState>}
 */
class Exercise extends React.Component<ExerciseProps, ExerciseState> {
  guideVideo = React.createRef<HTMLVideoElement>();
  userVideo = React.createRef<HTMLVideoElement>();
  userStream : MediaStream | null;
  
  static defaultProps = {
    videoWidth: 800,
    videoHeight: 600,
  };

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
      record: null,
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
        width: this.props.videoWidth,
        height: this.props.videoHeight,
      },
    });
  }

  componentDidMount = async () => {
    const [guideSource, userStream] = await Promise.all([
      this.loadVideo(this.state.id),
      this.loadStream(),
    ])

    const guideVideo = this.guideVideo.current!;
    const userVideo = this.userVideo.current!;
    guideVideo.src = guideSource;
    userVideo.srcObject = userStream;

    this.userStream = userStream;

    const onBothVideoLoad = new Promise((resolve) => {
      let cnt = 0;
      const incrementCnt = () => {
        cnt += 1;
        if (cnt >= 2) resolve();
      };
      guideVideo.onloadeddata = incrementCnt;
      userVideo.onloadeddata = incrementCnt;
    });
    await onBothVideoLoad;

    this.setState({
      ...this.state,
      isLoading: false,
    });
  };

  componentWillUnmount = () => {
    if (this.userStream) {
      this.userStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  handleExerciseFinish = async (record: Record) => {
    try {
      const response = await axios.post(`${apiAddress}/exercises/${this.state.id}/history`, {
        'score': record.score,
        'play_time': timeToString(record.playTime),
        'cal': record.calorie,
      });

      console.log(response);
      // response.data.code != 200이면?
      if (response.data.code === 200) {
        this.setState({
          ...this.state,
          record: record,
          redirectToResult: true,
        });
      } else {
        console.log('ㅋㅋ..;;');
      }
    } catch(error) {
      console.log('ㅋㅋ..ㅈㅅ!!ㅎㅎ..');
    }
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
          exerciseId: this.state.id,
          score: this.state.record.score,
          time: this.state.record.playTime,
          calorie: this.state.record.calorie,
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
          <Loading/>
          <Footer/>
        </div>
      );
    } else {
      return (
        <div>
          <Header/>
          { videos }
          <Screen
            onExerciseFinish = { this.handleExerciseFinish }
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
          <Footer/>
        </div>
      );
    }
  }
};

export default Exercise;
