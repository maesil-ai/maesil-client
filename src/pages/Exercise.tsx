import { getExercise, postResult, getUserInfo } from 'utility/api';

import React from 'react';
import ExerciseScreen from 'components/ExerciseScreen';
import Header from 'components/Header';
import Footer from 'components/Footer';
import Loading from 'components/Loading';
import { Redirect } from 'react-router-dom';
import Title from 'components/Title';
import { PlayRecord, PoseData, APIGetUserInfoData } from 'utility/types';

interface ExerciseProps {
  videoWidth: number;
  videoHeight: number;
  match?: any;
  history?: any;
}

interface ExerciseState {
  isLoading: boolean;
  isCameraRejected: boolean;
  isFinished: boolean;
  redirectToResult: boolean;
  id: number;
  userInfo?: APIGetUserInfoData;
  record: PlayRecord | null;
  url?: string;
}

/**
 * Exercise 페이지
 * @class Exercise
 * @extends {React.Component<ExerciseProps, ExerciseState>}
 */
class Exercise extends React.Component<ExerciseProps, ExerciseState> {
  guideVideo = React.createRef<HTMLVideoElement>();
  userVideo = React.createRef<HTMLVideoElement>();
  userStream: MediaStream | null;
  guidePose?: PoseData;

  static defaultProps = {
    videoWidth: 800,
    videoHeight: 600,
  };

  /**
   * Creates an instance of Exercise.
   * @param {ExerciseProps} props
   * @memberof Exercise
   */
  constructor(props: ExerciseProps) {
    super(props);

    this.state = {
      isLoading: true,
      isCameraRejected: false,
      isFinished: false,
      redirectToResult: false,
      id: props.match.params.id,
      record: null,
    };
  }

  loadStream = async () => {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: this.props.videoWidth,
          height: this.props.videoHeight,
        },
      });
    } catch (error) {
      this.setState({
        ...this.state,
        isCameraRejected: true,
      });
      throw error;
    }
  };

  componentDidMount = async () => {
    const [
      { video_url: guideSource, skeleton: guidePose },
      userStream,
      userInfo,
    ] = await Promise.all([getExercise(this.state.id), this.loadStream(), getUserInfo()]);

    if (guidePose) this.guidePose = JSON.parse(guidePose) as PoseData;

    const guideVideo = this.guideVideo.current;
    const userVideo = this.userVideo.current;
    guideVideo.src = guideSource;
    userVideo.srcObject = userStream;

    this.userStream = userStream;

    await new Promise((resolve) => {
      let cnt = 0;
      const incrementCnt = () => {
        cnt += 1;
        if (cnt >= 2) resolve();
      };
      guideVideo.onloadeddata = incrementCnt;
      userVideo.onloadeddata = incrementCnt;
    });

    this.setState({
      ...this.state,
      userInfo: userInfo,
      isLoading: false,
    });
  };

  componentWillUnmount = () => {
    if (this.userStream) {
      this.userStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  handleExerciseFinish = async (record: PlayRecord) => {
    await postResult(this.state.id, record.score, record.time, record.calorie);

    this.setState({
      ...this.state,
      record: record,
      redirectToResult: true,
    });
  };

  render() {
    // 운동이 끝나서 결과창으로 보내야 할 때
    if (this.state.redirectToResult) {
      return (
        <Redirect
          push
          to={{
            pathname: '/result',
            state: {
              exerciseId: this.state.id,
              score: this.state.record.score,
              time: this.state.record.time,
              calorie: this.state.record.calorie,
            },
          }}
        />
      );
    }

    // Pose estimation을 수행할 video들.
    // 유저에게 보이지 않지만 두 <video/>의 스트림이 posenet에 들어간다.
    const videos = (
      <div>
        <video
          height={this.props.videoHeight}
          width={this.props.videoWidth}
          crossOrigin={'anonymous'}
          style={{ display: 'none' }}
          ref={this.guideVideo}
        />
        <video
          height={this.props.videoHeight}
          width={this.props.videoWidth}
          crossOrigin={'anonymous'}
          style={{ display: 'none' }}
          ref={this.userVideo}
        />
      </div>
    );

    // 시작하기 전, 운동 정보를 로딩 중.
    if (this.state.isLoading) {
      return (
        <>
          <Header />
          {videos}
          <Loading />
          <Footer />
        </>
      );
    }
    // 카메라 권한을 거절당했을 때...ㅠ
    else if (this.state.isCameraRejected) {
      return (
        <>
          <Header />
          <Title title="운동을 인식하기 위해 카메라가 필요합니다. 카메라 권한을 허용해 주세요." />
          <Footer />
        </>
      );
    }
    // 정상적인 운동 화면. 운동의 처리는 ExerciseScreen 컴포넌트에서 모두 이루어진다.
    else {
      return (
        <div>
          <Header />
          {videos}
          <ExerciseScreen
            onExerciseFinish={this.handleExerciseFinish}
            videoWidth={this.props.videoWidth}
            videoHeight={this.props.videoHeight}
            userInfo={this.state.userInfo}
            views={[
              {
                // Guide View
                video: this.guideVideo.current!,
                scale: 1,
                offset: [0, 0],
              },
              {
                // User View
                video: this.userVideo.current!,
                scale: 0.3,
                offset: [540, 400],
              },
            ]}
            guidePose={this.guidePose}
          />
          <Footer />
        </div>
      );
    }
  }
}

export default Exercise;
