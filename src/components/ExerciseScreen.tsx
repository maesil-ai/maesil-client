import React from 'react';
import PoseCalculator from 'utility/poseCalculator';
import { drawBoundingBox, drawKeypoints, drawSkeleton } from 'utility/draw';
import { exerciseScore } from 'utility/score';
import { exerciseCalorie } from 'utility/calorie';
import { Switch } from '@material-ui/core';

import {
  APIGetUserInfoData,
  ScreenView,
  Pose,
  PlayRecord,
  fps,
  PoseData,
} from 'utility/types';
import store from 'store';

interface ViewConfig {
  flipPoseHorizontal: boolean;
  showVideo: boolean;
  showSkeleton: boolean;
  showPoints: boolean;
  showBoundingBox: boolean;
  showProgress: boolean;
  showCount: boolean;
  showScore: boolean;
  minPoseConfidence: number;
  minPartConfidence: number;
}

const defaultViewConfig = {
  flipPoseHorizontal: false,
  showVideo: true,
  showSkeleton: true,
  showPoints: true,
  showBoundingBox: true,
  showProgress: true,
  showCount: true,
  showScore: true,
  minPoseConfidence: 0.15,
  minPartConfidence: 0.1,
};

interface ExerciseScreenProps {
  phase: 'exercise' | 'break';
  videoWidth: number;
  videoHeight: number;
  views: ScreenView[];
  viewConfig: ViewConfig;
  time?: number;
  guidePose?: PoseData;
  onExerciseFinish: (record: PlayRecord) => any;
  repeat: number;
  match?: any;
}

// Records[view 번호][exercise 번호][frame 번호] => 해당 시점의 Pose
interface ExerciseScreenState {
  count: number;
  isPlaying: boolean;
  records: Pose[][][];
  scores: number[];
  progress: number,
  viewConfig: ViewConfig;
  useKalmanFilters: boolean;
}

/**
 * Screen 클래스
 * 운동하고 있는 화면을 보여주는 스크린
 * @param {view} 유저 화면의 구성 계획. 보여줄 비디오와 크기, 위치를 모두 포함하는 오브젝트. 0번 view는 가이드 영상을 보여주어야 한다.
 * @param {repeat} 운동의 반복 횟수. 0번 view의 영상이 repeat번 반복되면 결과 화면으로 보낸다.
 * @class Screen
 * @extends {React.Component<ExerciseScreenProps, ExerciseScreenState>}
 */
class ExerciseScreen extends React.Component<
  ExerciseScreenProps,
  ExerciseScreenState
> {
  static defaultProps: ExerciseScreenProps = {
    phase: 'exercise',
    videoWidth: 800,
    videoHeight: 600,
    views: [],
    onExerciseFinish: () => {},
    viewConfig: defaultViewConfig,
    repeat: 1,
  };
  
  ctx: CanvasRenderingContext2D;
  canvas: React.RefObject<HTMLCanvasElement>;
  views: ScreenView[];

  constructor(props: ExerciseScreenProps) {
    super(props);

    this.canvas = React.createRef<HTMLCanvasElement>();
    this.views = this.props.views;
    this.state = {
      count: 0,
      isPlaying: true,
      progress: 0,
      records: [],
      scores: [],
      viewConfig: this.props.viewConfig,
      useKalmanFilters: true,
    };

    this.views.forEach((view) =>
      Object.assign(view, {
        calculator: new PoseCalculator(view.video),
      })
    );

    if (this.props.phase == 'exercise') this.views[0].video.onended = this.finish;
  }

  finish = () => {
    if (this.props.phase == 'exercise') {
      const guideRecord = this.views[0].calculator.record;
      const userRecord = this.views[1].calculator.record;

      let newCount = this.state.count + 1;
      let newScore = exerciseScore(guideRecord, userRecord);

      this.setState({
        ...this.state,
        count: newCount,
        scores: Array.prototype.concat(this.state.scores, [newScore]),
        progress: 0,
      });

      let records = this.state.records;
      this.views.forEach((view, i) => {
        records[i] = Array.prototype.concat(records[i], [
          view.calculator.record,
        ]);
        view.calculator.clearRecord();
      });

      if (newCount === this.props.repeat) {
        this.setState({
          ...this.state,
          isPlaying: false,
        });

        const scores = this.state.scores;
        const averageScore = scores.reduce((x, y) => x + y, 0) / scores.length;
        
        this.props.onExerciseFinish({
          score: averageScore,
          playTime: (guideRecord.length / fps) * this.props.repeat,
          calorie: exerciseCalorie(userRecord, guideRecord.length),
        });
      } else {
        this.views[0].video.load();
        this.views[0].video.onloadeddata = () => {
          this.views[0].calculator.readyToUse = true;
          this.views[1].calculator.readyToUse = true;
          this.views[0].video.play();
        };
      }
    }

    if (this.props.phase == 'break') {
      let newCount = this.state.count + 1;

      this.setState({
        ...this.state,
        count: newCount,
        progress: 0,
      });

      if (newCount === this.props.repeat) {
        this.setState({
          ...this.state,
          isPlaying: false,
        });
        this.props.onExerciseFinish({
          score: 1,
          playTime: 0,
          calorie: 0,
        });
      }
    }
  };

  componentDidMount = async () => {
    this.ctx = this.canvas.current!.getContext('2d')!;

    await Promise.all(
      this.views.map((view, idx) =>
        view.calculator.load(idx == 0 ? this.props.guidePose : undefined)
      )
    );

    this.drawCanvas();
  };

  componentWillUnmount = () => {
    this.views.map((view) => view.video.remove());
  };

  drawCanvas = () => {
    const ctx = this.ctx!;

    for (let i = 0; i < this.views.length; i++) {
      this.views[i].video.play();
    }

    const drawVideoPose = (
      video: CanvasImageSource,
      poses: Pose[],
      scale = 1,
      offset: [number, number] = [0, 0]
    ) => {
      const ctx = this.ctx!;

      if (this.state.viewConfig.showVideo) {
        ctx.save();
        ctx.translate(
          this.state.viewConfig.flipPoseHorizontal
            ? scale * this.props.videoWidth
            : 0,
          0
        );
        ctx.scale(this.state.viewConfig.flipPoseHorizontal ? -1 : 1, 1);
        ctx.drawImage(
          video,
          (this.state.viewConfig.flipPoseHorizontal ? -1 : 1) * offset[0],
          offset[1],
          this.props.videoWidth * scale,
          this.props.videoHeight * scale
        );
        ctx.restore();
      }

      if (poses) {
        console.log(poses);
        poses.forEach(({ score, keypoints }) => {
          if (score >= this.state.viewConfig.minPoseConfidence) {
            if (this.state.viewConfig.showPoints)
              drawKeypoints(
                keypoints,
                this.state.viewConfig.minPartConfidence,
                ctx,
                scale,
                offset
              );
            if (this.state.viewConfig.showSkeleton)
              drawSkeleton(
                keypoints,
                this.state.viewConfig.minPartConfidence,
                ctx,
                scale,
                offset
              );
            if (this.state.viewConfig.showBoundingBox)
              drawBoundingBox(keypoints, ctx, scale, offset);
          }
        });
      }
    };

    let executeEveryFrame = (callback: { (): void; (): void }) => {
      callback();

      if (this.state.isPlaying)
        setTimeout(() => executeEveryFrame(callback), 1000 / fps);
    };

    executeEveryFrame(() => {
      this.setState({
        ...this.state,
        progress: 
          this.props.phase == 'exercise' ? this.views[0].video.currentTime / this.views[0].video.duration :
          this.props.phase == 'break' ? this.state.progress + 1 / 30 / this.props.time : 0,
      });

      if (this.props.phase == 'break' && this.state.progress >= 1) {
        this.finish();
      }
    })

    executeEveryFrame(() => {
      ctx.clearRect(0, 0, this.props.videoWidth, this.props.videoHeight);
      this.views.forEach((view) => {
        view.calculator.getPoseResult();
        drawVideoPose(
          view.video,
          view.calculator.resultPoses,
          view.scale,
          view.offset
        );
      });
      if (this.state.viewConfig.showCount) {
        const x = this.props.videoWidth - 40, y = 20, w = 20, h = 20;

        for (let i = 0; i < this.props.repeat; i++) {
          ctx.fillStyle = this.state.count > i ? 'rgb(22, 22, 22)' : 'rgb(222, 222, 222)';
          ctx.fillRect(x - 40 * i, y, w, h);
        }
      }
      if (this.state.viewConfig.showScore) {
        const x = this.props.videoWidth - 20, y = this.props.videoHeight / 2;

        ctx.fillStyle = 'rgb(22, 22, 22)';
        ctx.font = '40px arial';
        ctx.textAlign = 'right';
        if (this.state.scores.length) {
          const score = this.state.scores[this.state.scores.length - 1];
          ctx.fillText(`${Math.round(score * 100)}점`, x, y);
        }
      }
      if (this.state.viewConfig.showProgress) {
        const x = 20,
          y = this.props.videoHeight - 20,
          h = 10,
          w = this.props.videoWidth - 40;

        ctx.fillStyle = 'rgb(22, 22, 22)';
        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = 'rgb(222, 22, 22)';
        ctx.fillRect(x, y, w * this.state.progress, h);
      }
    });
  };

  checkSkeleton = (_event: any, checked: boolean) => {
    this.setState({
      ...this.state,
      viewConfig: {
        ...this.state.viewConfig,
        showSkeleton: checked,
        showPoints: checked,
        showBoundingBox: checked,
      },
    });
  };

  checkKalmanFilters = (_event: any, checked: boolean) => {
    this.views.forEach((view) => {
      view.calculator.useFilters = checked;
    });
    this.setState({
      ...this.state,
      useKalmanFilters: checked,
    });
  };

  render() {
    return (
      <div style={{ width: this.props.videoWidth }}>
        <canvas
          ref={this.canvas}
          width={this.props.videoWidth}
          height={this.props.videoHeight}
        >
          운동 기능이 지원되지 않는 브라우저입니다..ㅠㅠ
        </canvas>
      </div>
    );
  }
}

export default ExerciseScreen;
