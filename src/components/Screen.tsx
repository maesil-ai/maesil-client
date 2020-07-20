import React from 'react';
import PoseCalculator, { Pose } from '../utility/poseCalculator';
import {
  drawBoundingBox,
  drawKeypoints,
  drawSkeleton,
} from '../utility/draw';
import { exerciseScore } from '../utility/score';

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
  minPoseConfidence: number,
  minPartConfidence: number,
};

const defaultViewConfig = {
  flipPoseHorizontal: false,
  showVideo: true,
  showSkeleton: true,
  showPoints: true,
  showBoundingBox: true,
  minPoseConfidence: 0.15,
  minPartConfidence: 0.1,
};

interface ScreenProps {
    videoWidth: number,
    videoHeight: number,
    views: View[],
    viewConfig: ViewConfig,
    onExerciseFinish: (record: any) => any,
    match?: any,
};

interface ScreenState {
  finishCount: number,
};


/**
 * Screen 클래스
 * 운동하고 있는 화면을 보여주는 스크린
 * @class Screen
 * @extends {React.Component<ScreenProps, ScreenState>}
 */
class Screen extends React.Component<ScreenProps, ScreenState> {
    static defaultProps : ScreenProps = {
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
     * @param {ScreenProps} props
     * @memberof Screen
     */
    constructor(props: ScreenProps) {
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

          if (finishCount == 1) {
            this.props.onExerciseFinish({
              score: exerciseScore(this.views[0].calculator.record, this.views[1].calculator.record),
              time: 63*60,
              calorie: 1021,
            });
          }
        }
      }
    }

    /**
     * 리액트 컴포넌트 클래스 기본 함수
     * @memberof Screen
     */
    componentDidMount() {
      this.ctx = this.canvas.current!.getContext('2d')!;
      let promises : Promise<void>[] = [];
      for (let i=0; i<this.views.length; i++) {
        promises.push(this.views[i].calculator.load());
      }

      Promise.all(promises).then(() => {
        this.drawCanvas();
      });
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
      function executeEveryFrame(callback) {
        //            stats.begin();
        callback();
        //            stats.end();

        requestAnimationFrame(() => {
          executeEveryFrame(callback);
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
      });
    }

    /**
     * 직접 실행할일은 없음, 지원하지 않을때는 뜨는 함수
     * @return {any} HTML 반환
     * @memberof Screen
     */
    render() {
      return (
        <div>
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


export default Screen;
