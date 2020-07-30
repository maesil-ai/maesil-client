import React from 'react';
import PoseCalculator, { Pose } from '../utility/poseCalculator';
import {
  drawBoundingBox,
  drawKeypoints,
  drawSkeleton,
} from '../utility/draw';
import { exerciseScore } from '../utility/score';
import { exerciseCalorie } from '../utility/calorie';

interface View {
    video: HTMLVideoElement,
    scale: number,
    offset: [number, number],
    calculator?: PoseCalculator,
};

interface ViewConfig {
  flipPoseHorizontal: boolean,
  showVideo: boolean,
  showSkeleton: boolean,
  showPoints: boolean,
  showBoundingBox: boolean,
  showProgress: boolean,
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
  minPoseConfidence: 0.15,
  minPartConfidence: 0.1,
};

interface ExerciseScreenProps {
    videoWidth: number,
    videoHeight: number,
    views: View[],
    viewConfig: ViewConfig,
    onExerciseFinish: (record: any) => any,
    match?: any,
};

interface ExerciseScreenState {
  finishCount: number,
};


/**
 * Screen 클래스
 * 운동하고 있는 화면을 보여주는 스크린
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
    };

    ctx: CanvasRenderingContext2D;
    canvas: React.RefObject<HTMLCanvasElement>;
    views: View[];
    viewConfig: ViewConfig;

    /**
     * Creates an instance of Screen.
     * @param {ExerciseScreenProps} props
     * @memberof Screen
     */
    constructor(props: ExerciseScreenProps) {
      super(props);

      this.canvas = React.createRef<HTMLCanvasElement>();
      this.viewConfig = this.props.viewConfig;
      this.views = this.props.views;
      this.state = {
        finishCount: 0,
      };

      for (let i=0; i<this.views.length; i++) {
        Object.assign(this.views[i], {
          calculator: new PoseCalculator(this.views[i].video),
        });

        this.views[i].video.onended = () => {
          let finishCount = this.state.finishCount + 1;
          this.setState({
            finishCount: finishCount,
          });

          if (finishCount === 1) {
            const guideRecord = this.views[0].calculator.record;
            const userRecord = this.views[1].calculator.record;
            this.props.onExerciseFinish({
              score: exerciseScore(guideRecord, userRecord),
              playTime: guideRecord.length,
              calorie: exerciseCalorie(guideRecord, userRecord),
            });
          }
        }
      }
    }

    /**
     * 리액트 컴포넌트 클래스 기본 함수
     * @memberof Screen
     */
    async componentDidMount() {
      this.ctx = this.canvas.current!.getContext('2d')!;

      await Promise.all(this.views.map(view => view.calculator.load()));

      this.drawCanvas();
    }

    drawCanvas = () => {
      const ctx = this.ctx!;

      for (let i=0; i<this.views.length; i++) {
        this.views[i].video.play();
      }

      const drawVideoPose = (video: CanvasImageSource, poses: Pose[], scale = 1,
          offset: [number, number] = [0, 0]) => {
        const ctx = this.ctx!;

        if (this.viewConfig.showVideo) {
          ctx.save();
          ctx.translate(this.viewConfig.flipPoseHorizontal ?
            (scale * this.props.videoWidth) : 0, 0);
          ctx.scale(this.viewConfig.flipPoseHorizontal ? -1 : 1, 1);
          ctx.drawImage(
              video,
              (this.viewConfig.flipPoseHorizontal ? -1 : 1) * offset[0],
              offset[1],
              this.props.videoWidth * scale,
              this.props.videoHeight * scale,
          );
          ctx.restore();
        }

        if (poses) {
          poses.forEach(({score, keypoints}) => {
            if (score >= this.viewConfig.minPoseConfidence) {
              if (this.viewConfig.showPoints) {
                drawKeypoints(keypoints,
                    this.viewConfig.minPartConfidence, ctx, scale, offset);
              }
              if (this.viewConfig.showSkeleton) {
                drawSkeleton(keypoints,
                    this.viewConfig.minPartConfidence, ctx, scale, offset);
              }
              if (this.viewConfig.showBoundingBox) {
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
          if (this.state.finishCount < 1) executeEveryFrame(callback);
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
        if (this.viewConfig.showProgress) {
          //const x = 0, y = 0, h = 400, w = 400;
          const x = 20, y = this.props.videoHeight - 20, h = 10, w = this.props.videoWidth - 40;
          
          console.log(x, y, w, h);
          ctx.fillStyle = "rgb(22, 22, 22)";
          ctx.fillRect(x, y, w, h);

          ctx.fillStyle = "rgb(222, 22, 22)";
          ctx.fillRect(x, y, w * this.views[0].video.currentTime / this.views[0].video.duration, h);
        }
      });
    }

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
        </div>
      );
    }
}


export default ExerciseScreen;
