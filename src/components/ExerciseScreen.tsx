import React from 'react';
import PoseCalculator from 'utility/poseCalculator';
import {
  drawBoundingBox,
  drawKeypoints,
  drawSkeleton,
} from 'utility/draw';
import { exerciseScore } from 'utility/score';
import { exerciseCalorie } from 'utility/calorie';
import { Switch } from '@material-ui/core';
import { ScreenView, Pose, PlayRecord } from 'utility/types';

interface ViewConfig {
  flipPoseHorizontal: boolean,
  showVideo: boolean,
  showSkeleton: boolean,
  showPoints: boolean,
  showBoundingBox: boolean,
  showProgress: boolean,
  showCount: boolean,
  showScore: boolean,
  minPoseConfidence: number,
  minPartConfidence: number,
};

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
    videoWidth: number,
    videoHeight: number,
    views: ScreenView[],
    viewConfig: ViewConfig,
    onExerciseFinish: (record: PlayRecord) => any,
    repeat: number,
    match?: any,
};

// Records[view 번호][exercise 번호][frame 번호] => 해당 시점의 Pose
interface ExerciseScreenState {
  count: number,
  isFinished: boolean,
  records: Pose[][][],
  scores: number[],
  viewConfig: ViewConfig,
  useKalmanFilters: boolean,
};


/**
 * Screen 클래스
 * 운동하고 있는 화면을 보여주는 스크린
 * @param {view} 유저 화면의 구성 계획. 보여줄 비디오와 크기, 위치를 모두 포함하는 오브젝트. 0번 view는 가이드 영상을 보여주어야 한다.
 * @param {repeat} 운동의 반복 횟수. 0번 view의 영상이 repeat번 반복되면 결과 화면으로 보낸다.
 * @class Screen
 * @extends {React.Component<ExerciseScreenProps, ExerciseScreenState>}
 */
class ExerciseScreen extends React.Component<ExerciseScreenProps, ExerciseScreenState> {
    static defaultProps : ExerciseScreenProps = {
      videoWidth: 800,
      videoHeight: 600,
      views: [],
      onExerciseFinish: () => {},
      viewConfig: defaultViewConfig,
      repeat: 5,
    };

    ctx: CanvasRenderingContext2D;
    canvas: React.RefObject<HTMLCanvasElement>;
    views: ScreenView[];

    /**
     * Creates an instance of Screen.
     * @param {ExerciseScreenProps} props
     * @memberof Screen
     */
    constructor(props: ExerciseScreenProps) {
      super(props);

      this.canvas = React.createRef<HTMLCanvasElement>();
      this.views = this.props.views;
      this.state = {
        count: 0,
        isFinished: false,
        records: [],
        scores: [],
        viewConfig: this.props.viewConfig,
        useKalmanFilters: true,
      };

      this.views.forEach((view) => Object.assign(view, {
        calculator: new PoseCalculator(view.video),
      }));

      this.views[0].video.onended = () => {
        const guideRecord = this.views[0].calculator.record;
        const userRecord = this.views[1].calculator.record;

        let newCount = this.state.count + 1;
        let newScore = exerciseScore(guideRecord, userRecord);

        this.setState({
          ...this.state,
          count: newCount,
          scores: Array.prototype.concat(this.state.scores, [newScore]),
        });
        
        let records = this.state.records;
        this.views.forEach((view, i) => {
          records[i] = Array.prototype.concat(records[i], [view.calculator.record]);
          view.calculator.clearRecord();
        });

        if (newCount === this.props.repeat) {
          this.setState({
            ...this.state,
            isFinished: true,
          });

          const scores = this.state.scores;
          const averageScore = scores.reduce((x, y) => (x + y), 0) / scores.length;
          this.props.onExerciseFinish({
            score: averageScore,
            time: guideRecord.length,
            calorie: exerciseCalorie(userRecord, guideRecord.length, {height: 1.758, weight:65.7, age:25}),
          });
        } else {
          this.views[0].video.load();
          this.views[0].video.onloadeddata = () => {
            this.views[0].calculator.readyToUse = true;
            this.views[1].calculator.readyToUse = true;
            this.views[0].video.play();
          }
        }
      }
    }

    /**
     * 리액트 컴포넌트 클래스 기본 함수
     * @memberof Screen
     */
    componentDidMount = async () =>  {
      this.ctx = this.canvas.current!.getContext('2d')!;

      await Promise.all(this.views.map(view => view.calculator.load()));

      this.drawCanvas();
    }

    componentWillUnmount = () => {
      this.views.map(view => view.video.remove() );
    }

    drawCanvas = () => {
      const ctx = this.ctx!;

      for (let i=0; i<this.views.length; i++) {
        this.views[i].video.play();
      }

      const drawVideoPose = (video: CanvasImageSource, poses: Pose[], scale = 1,
          offset: [number, number] = [0, 0]) => {
        const ctx = this.ctx!;

        if (this.state.viewConfig.showVideo) {
          ctx.save();
          ctx.translate(this.state.viewConfig.flipPoseHorizontal ?
            (scale * this.props.videoWidth) : 0, 0);
          ctx.scale(this.state.viewConfig.flipPoseHorizontal ? -1 : 1, 1);
          ctx.drawImage(
              video,
              (this.state.viewConfig.flipPoseHorizontal ? -1 : 1) * offset[0],
              offset[1],
              this.props.videoWidth * scale,
              this.props.videoHeight * scale,
          );
          ctx.restore();
        }

        if (poses) {
          poses.forEach(({score, keypoints}) => {
            if (score >= this.state.viewConfig.minPoseConfidence) {
              if (this.state.viewConfig.showPoints) {
                drawKeypoints(keypoints,
                    this.state.viewConfig.minPartConfidence, ctx, scale, offset);
              }
              if (this.state.viewConfig.showSkeleton) {
                drawSkeleton(keypoints,
                    this.state.viewConfig.minPartConfidence, ctx, scale, offset);
              }
              if (this.state.viewConfig.showBoundingBox) {
                drawBoundingBox(keypoints, ctx, scale, offset);
              }
            }
          });
        }
      };

      /**
       * 매 프레임 마다 다시 콜백으로 자기를 불러서 무한반복으로 실행
       * @param {*} callback 자기자신
       */
      let executeEveryFrame = (callback) => {
        //            stats.begin();
        callback();
        //            stats.end();

        requestAnimationFrame(() => {
          if (!this.state.isFinished) executeEveryFrame(callback);
        });
      }

      executeEveryFrame(() => {
        ctx.clearRect(0, 0, this.props.videoWidth, this.props.videoHeight);
        for (let i = 0; i < this.views.length; i++) {
          this.views[i].calculator.getPoseResult();
          drawVideoPose(this.views[i].video,
              this.views[i].calculator.resultPoses,
              this.views[i].scale,
              this.views[i].offset);
        }
        if (this.state.viewConfig.showCount) {
          const x = this.props.videoWidth - 40, y = 20, w = 20, h = 20;

          for (let i=0; i<this.props.repeat; i++) {
            ctx.fillStyle = (this.state.count > i) ? "rgb(22, 22, 22)" : "rgb(222, 222, 222)";
            ctx.fillRect(x - 40 * i, y, w, h);
          }
        }
        if (this.state.viewConfig.showScore) {
          const x = this.props.videoWidth - 20, y = this.props.videoHeight / 2;
          ctx.fillStyle = "rgb(22, 22, 22)";
          ctx.font = "40px arial";
          ctx.textAlign = "right";
          if (this.state.scores.length) {
            const score = this.state.scores[this.state.scores.length-1];
    
            ctx.fillText(`${Math.round(score*100)}점`, x, y);
          }
        }
        if (this.state.viewConfig.showProgress) {
          const x = 20, y = this.props.videoHeight - 20, h = 10, w = this.props.videoWidth - 40;
          
          ctx.fillStyle = "rgb(22, 22, 22)";
          ctx.fillRect(x, y, w, h);

          ctx.fillStyle = "rgb(222, 22, 22)";
          ctx.fillRect(x, y, w * this.views[0].video.currentTime / this.views[0].video.duration, h);
        }
      });
    }

    checkSkeleton = (event, checked : boolean) => {
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

    checkKalmanFilters = (event, checked : boolean) => {
      this.views.forEach((view) => {
        view.calculator.useFilters = checked;
      });
      this.setState({
        ...this.state,
        useKalmanFilters: checked,
      })
    };

    render() {
      return (
        <div style={{width: this.props.videoWidth}}>
          <canvas
            ref={this.canvas}
            width={this.props.videoWidth}
            height={this.props.videoHeight}
          >
            운동 기능이 지원되지 않는 브라우저입니다..ㅠㅠ
          </canvas>
          <label>
            <Switch id="Skeleton" onChange={this.checkSkeleton} checked={this.state.viewConfig.showSkeleton}/>
            운동 가이드 보기
          </label>
          <br/>
          <label>
            <Switch id="Kalman" onChange={this.checkKalmanFilters} checked={this.state.useKalmanFilters}/>
            칼만 필터 씌우기 (씌우면 움직임이 더 부드러워진다는 속설이 있습니다.)
          </label>
        </div>
      );
    }
}


export default ExerciseScreen;
