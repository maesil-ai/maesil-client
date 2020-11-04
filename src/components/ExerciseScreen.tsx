import React from 'react';
import PoseCalculator from 'utility/bodyCalculator';
import { draw3DPoints, drawBoundingBox, drawKeypoints, drawSegment, drawSkeleton, toTuple } from 'utility/draw';
import { exerciseScore, posePoseSimilarity } from 'utility/score';
import { exerciseCalorie } from 'utility/calorie';
import { Switch } from '@material-ui/core';

import {
  ScreenView,
  Pose2D,
  PlayRecord,
  fps,
  PoseData,
  Pose,
  Pose3D,
} from 'utility/types';
import { warningIcon } from 'utility/svg';
import Music from './Music';
import Loading from 'pages/Loading';

const LEFT_ELBOW = 7;
const RIGHT_ELBOW = 8;
const LEFT_WRIST = 9;
const RIGHT_WRIST = 10;

const waitingFrames = 89;

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

// showHits: show testing hit record for view[0];
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
  showHits: boolean;
}

// Records[view 번호][exercise 번호][frame 번호] => 해당 시점의 Pose
interface ExerciseScreenState {
  count: number;
  isPlaying: boolean;
  records: Pose2D[][][];
  scores: number[];
  liveScores: number[];
  progress: number;
  viewConfig: ViewConfig;
  useKalmanFilters: boolean;
  beforeStart: number;
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
    showHits: false,
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
      liveScores: [],
      viewConfig: this.props.viewConfig,
      useKalmanFilters: true,
      beforeStart: waitingFrames + 2,
    };

    this.views.forEach((view) =>
      Object.assign(view, {
        calculator: new PoseCalculator(view.video),
      })
    );

    if (this.props.phase == 'exercise') this.views[0].video.onended = this.finish;
  }

  start = () => {
    console.log('Starting!');
    this.views.forEach((view) => view.video.load());
    console.log('Loaded!');
    this.views[1].video.onloadeddata = () => {
      this.views.forEach((view) => view.calculator.readyToUse = true );
      if (this.state.count == 0) this.setState({
        ...this.state,
        beforeStart: waitingFrames + 1,
      })
      else this.views.forEach((view) => view.video.play());
    };
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
        liveScores: [],
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
        this.start();
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

    this.start();
    this.drawCanvas();
  };

  componentWillUnmount = () => {
    this.views.map((view) => view.video.remove());
  };

  drawCanvas = () => {
    const ctx = this.ctx!;

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

      if (poses && poses.length > 0) {
        if ("keypoints" in poses[0]) poses.forEach((pose : Pose2D) => {
            const keypoints = pose.keypoints;
            const score = pose.score;
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
        else {
            if (this.state.viewConfig.showPoints) {
              draw3DPoints(poses as unknown as Pose3D, ctx);
            }
        }
      }

      if (this.props.showHits && this.views[0].poseData.dimension == '2d') {
/*        for (let pose of this.views[0].calculator.record) {
          if (pose.score >= this.state.viewConfig.minPoseConfidence) {
  //          if (pose.keypoints[LEFT_ELBOW].score >= this.state.viewConfig.minPartConfidence && pose.keypoints[LEFT_WRIST].score >= this.state.viewConfig.minPartConfidence)
  //            drawSegment(toTuple(pose.keypoints[LEFT_ELBOW].position), toTuple(pose.keypoints[LEFT_WRIST].position), 'blue', ctx);
            if (pose.keypoints[RIGHT_ELBOW].score >= this.state.viewConfig.minPartConfidence && pose.keypoints[RIGHT_WRIST].score >= this.state.viewConfig.minPartConfidence)
              drawSegment(toTuple(pose.keypoints[RIGHT_ELBOW].position), toTuple(pose.keypoints[RIGHT_WRIST].position), 'blue', ctx);
          }
        }
*/
        let pose2 = this.views[0].calculator.record[this.views[0].calculator.record.length-1] as Pose2D;

        let pose1 : Pose2D = null;
        for (let i = this.views[0].calculator.record.length-1; i>=0; i--) if (this.views[0].calculator.record[i] != pose2) {
          pose1 = this.views[0].calculator.record[i] as Pose2D;
          break;
        }

        if (pose1 && pose2 && pose1.score >= this.state.viewConfig.minPoseConfidence && pose2.score >= this.state.viewConfig.minPoseConfidence && pose1.keypoints[RIGHT_ELBOW].score >= this.state.viewConfig.minPartConfidence && pose1.keypoints[RIGHT_WRIST].score >= this.state.viewConfig.minPartConfidence && pose2.keypoints[RIGHT_ELBOW].score >= this.state.viewConfig.minPartConfidence && pose2.keypoints[RIGHT_WRIST].score >= this.state.viewConfig.minPartConfidence) {
          let {x : x1, y : y1} = pose1.keypoints[RIGHT_WRIST].position;
          let {x : x2, y : y2} = pose2.keypoints[RIGHT_WRIST].position;

          drawSegment([y1, x1], [y2+50*(y2-y1), x2+50*(x2-x1)], 'black', ctx);
        }
      }
    };

    let executeEveryFrame = (callback: { (): void; (): void }) => {
      callback();

      if (this.state.isPlaying)
        setTimeout(() => executeEveryFrame(callback), 1000 / fps);
    };

    executeEveryFrame(() => {
      if (this.state.beforeStart > 0)
        return;

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

      if (this.state.beforeStart > waitingFrames + 1) return;

      let poses : Pose[] = [];
      this.views.forEach((view) => {
        view.calculator.getPoseResult(this.state.beforeStart == 0);
        if (view.calculator.record.length > 0)
          poses.push(view.calculator.record[view.calculator.record.length - 1]);
        drawVideoPose(
          view.video,
          view.calculator.resultPoses,
          view.scale,
          view.offset
        );
      });

      this.setState({
        ...this.state,
        liveScores: this.state.liveScores.concat(poses.length == 2 ? [posePoseSimilarity(poses[0], poses[1])] : (this.state.liveScores.length > 0 ? [] : [0])),
      });

      if (this.state.viewConfig.showProgress) {
        const x = 0,
          y = this.props.videoHeight - 10,
          h = 10,
          w = this.props.videoWidth;

        ctx.fillStyle = 'rgb(222, 222, 222)';
        ctx.fillRect(x, y, w, h);

        let i = 0;
        for (let score of this.state.liveScores) {
          if (i == 0 && this.state.liveScores.length > 1) score = this.state.liveScores[1];
          if (score < 0) score = 0;
          score = Math.floor(score * 100);
          if (this.props.phase == 'break') score = 100;
          ctx.fillStyle = `rgb(${222-2*score}, ${2*score+22}, 100)`;
          ctx.fillRect(x + i * w * this.state.progress / this.state.liveScores.length - 1, y, 
                      w * this.state.progress / this.state.liveScores.length + 2, h);
          i++;
        }
      }

      if (this.state.beforeStart > 0) {
        ctx.clearRect(0, 0, this.props.videoWidth, this.props.videoHeight);
        this.setState({
          ...this.state,
          beforeStart: this.state.beforeStart - 1,
        });

        if (this.state.beforeStart <= 0) {
          this.setState({
            ...this.state,
            liveScores: [],
          })
          this.views.forEach((view) => view.video.play());
        }
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

  scoreMessage = (score: number) => {
    if (score == 0) return '파이팅!';
    else if (score < 0.1) return "Bad..";
    else if (score < 0.45) return "Good";
    else if (score < 0.8) return "Nice!";
    else return "Great!!";
  }

  scoreColor = (score: number) => {
    if (score < 0.1) return 'red';
    else if (score < 0.45) return 'black';
    else if (score < 0.8) return 'green';
    else return 'blue';
  }

  render() {
    return (
      <div style={{ width: this.props.videoWidth }}>
        { this.state.viewConfig.showScore && this.state.liveScores.length > 0 &&
          <div className='zone mini fly'
                style={{
                  transform: `translate(20px, ${this.props.videoHeight - 94}px)`, 
                  fontWeight: 600, 
                  color: this.scoreColor(this.state.liveScores[this.state.liveScores.length - 1])
                }}
          >
            { this.scoreMessage(this.state.liveScores[this.state.liveScores.length - 1]) }
          </div>
        }
        { this.state.viewConfig.showCount && this.props.repeat > 1 &&
          <div className='zone mini fly' style={{transform: `translate(${this.props.videoWidth - 180}px, 30px)`}}>
            { `${this.state.count+1} / ${this.props.repeat}` }
          </div>
        }
        { waitingFrames < this.state.beforeStart &&
          <div style={{position: 'absolute', left: 'calc(50% - 40px)', top: 'calc(50% - 40px'}}>
            <Loading mini={true} />
          </div>
        }
        { 0 < this.state.beforeStart && this.state.beforeStart <= waitingFrames &&
          <div className='zone fly' style={{transform: `translate(${this.props.videoWidth/2 - 48}px, ${this.props.videoHeight/2 - 48}px)`, width: '88px'}}>
            { Math.ceil(this.state.beforeStart / fps) }
          </div>
        }
        <canvas
          ref={this.canvas}
          width={this.props.videoWidth}
          height={this.props.videoHeight}
        >
          <div className='zone'>
            { warningIcon }
            <div style={{paddingBottom: '16px'}} />
            <h1 className='grey'> 이런! </h1>
            <div style={{paddingBottom: '16px'}} />
            <div>
              운동 기능을 이용할 수 없는 브라우저입니다..ㅜㅜ 최신 브라우저로 업데이트해 주세요.
            </div>
          </div>
        </canvas>
        </div>
    );
  }
}

export default ExerciseScreen;
