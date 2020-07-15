import React from 'react';
import * as posenet from "@tensorflow-models/posenet";
import {
    drawBoundingBox,
    drawKeypoints,
    drawSkeleton,
} from '../utility/draw';

interface View {
    video: HTMLVideoElement,
    poses?: any[], // *** 타입 지정하기! ***
    scale: number,
    offset: [number, number],
};

interface ScreenProps {
    videoWidth: number,
    videoHeight: number,
    views: View[],
    match?: any,
};

interface GuiState {
    algorithm: string,
    input: posenet.ModelConfig,
    singlePoseDetection: {
        minPoseConfidence: number,
        minPartConfidence: number,
    },
    multiPoseDetection: {
        maxPoseDetections: number,
        minPoseConfidence: number,
        minPartConfidence: number,
        nmsRadius: number,
    },
    output: {
        showVideo: boolean,
        showSkeleton: boolean,
        showPoints: boolean,
        showBoundingBox: boolean,
    },
    net?: posenet.PoseNet,
}

interface ScreenState {
    guiState: GuiState,
    flipPoseHorizontal: boolean,
};

const defaultInput : posenet.ModelConfig = {
    architecture: "MobileNetV1",
    multiplier: 0.75, // isMobile() ? 0.5 : 0.75,
    outputStride: 16,
    inputResolution: 250,
    quantBytes: 2,
};

// const defaultResNetMultiplier = 1.0;
// const defaultResNetStride = 32;
// const defaultResNetInputResolution = 250;

class Screen extends React.Component<ScreenProps, ScreenState> {
    canvas: React.RefObject<HTMLCanvasElement>;
    ctx?: CanvasRenderingContext2D;
    views: View[];

    constructor(props: ScreenProps) {
        super(props);

        this.views = this.props.views;
        this.canvas = React.createRef<HTMLCanvasElement>();
        this.state = {
            guiState: {
                algorithm: 'multi-pose',
                input: defaultInput,
                singlePoseDetection: {
                  minPoseConfidence: 0.1,
                  minPartConfidence: 0.5,
                },
                multiPoseDetection: {
                  maxPoseDetections: 5,
                  minPoseConfidence: 0.15,
                  minPartConfidence: 0.1,
                  nmsRadius: 30.0,
                },
                output: {
                  showVideo: true,
                  showSkeleton: true,
                  showPoints: true,
                  showBoundingBox: true,
                },
            },
            flipPoseHorizontal: false,
        };
    }

    componentDidMount() {
        this.ctx = this.canvas.current!.getContext("2d")!;

        posenet.load(this.state.guiState.input).then((poseNet) => {
            this.setState({
                ...this.state,
                guiState: {
                    ...this.state.guiState,
                    net: poseNet,
                }
            });
            this.drawPose();
        });
    }

    drawPose = () => {
        const ctx = this.ctx!;
        const guiState = this.state.guiState;
        const net = guiState.net!;

        const working : boolean[] = [];
        for (let i = 0; i < this.views.length; i++) {
          working[i] = false;
        }
      
        const applyPosenetChange = async () => {
          for (let i = 0; i < this.views.length; i++) {
            if (working[i]) {
              return;
            }
          }
/*      
          if (guiState.changeToArchitecture) {
            // Important to purge variables and free up GPU memory
            net.dispose();
            toggleLoadingUI(true);
            net = await posenet.load({
              architecture: guiState.changeToArchitecture,
              outputStride: guiState.outputStride,
              inputResolution: guiState.inputResolution,
              multiplier: guiState.multiplier,
            });
            toggleLoadingUI(false);
            guiState.architecture = guiState.changeToArchitecture;
            guiState.changeToArchitecture = null;
          }
      
          if (guiState.changeToMultiplier) {
            net.dispose();
            toggleLoadingUI(true);
            net = await posenet.load({
              architecture: guiState.architecture,
              outputStride: guiState.outputStride,
              inputResolution: guiState.inputResolution,
              multiplier: +guiState.changeToMultiplier,
              quantBytes: guiState.quantBytes,
            });
            toggleLoadingUI(false);
            guiState.multiplier = +guiState.changeToMultiplier;
            guiState.changeToMultiplier = null;
          }
      
          if (guiState.changeToOutputStride) {
            // Important to purge variables and free up GPU memory
            net.dispose();
            toggleLoadingUI(true);
            net = await posenet.load({
              architecture: guiState.architecture,
              outputStride: +guiState.changeToOutputStride,
              inputResolution: guiState.inputResolution,
              multiplier: guiState.multiplier,
              quantBytes: guiState.quantBytes,
            });
            toggleLoadingUI(false);
            guiState.outputStride = +guiState.changeToOutputStride;
            guiState.changeToOutputStride = null;
          }
      
          if (guiState.changeToInputResolution) {
            // Important to purge variables and free up GPU memory
            net.dispose();
            toggleLoadingUI(true);
            net = await posenet.load({
              architecture: guiState.architecture,
              outputStride: guiState.outputStride,
              inputResolution: +guiState.changeToInputResolution,
              multiplier: guiState.multiplier,
              quantBytes: guiState.quantBytes,
            });
            toggleLoadingUI(false);
            guiState.inputResolution = +guiState.changeToInputResolution;
            guiState.changeToInputResolution = null;
          }
      
          if (guiState.changeToQuantBytes) {
            // Important to purge variables and free up GPU memory
            net.dispose();
            toggleLoadingUI(true);
            net = await posenet.load({
              architecture: guiState.architecture,
              outputStride: guiState.outputStride,
              inputResolution: guiState.inputResolution,
              multiplier: guiState.multiplier,
              quantBytes: guiState.changeToQuantBytes,
            });
            toggleLoadingUI(false);
            guiState.quantBytes = guiState.changeToQuantBytes;
            guiState.changeToQuantBytes = null;
          }*/
        }
      
        const getPoseResult = async (video : HTMLVideoElement, index) => {
            if (working[index]) {
                return null;
            }
            working[index] = true;
        
            let poses : posenet.Pose[][] = [];
            let minPoseConfidence;
            let minPartConfidence;
            switch (guiState.algorithm) {
                case 'single-pose':
                const pose = await net.estimatePoses(video, {
                    flipHorizontal: this.state.flipPoseHorizontal,
                    decodingMethod: 'single-person',
                });
                poses = poses.concat(pose);
                minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence;
                minPartConfidence = +guiState.singlePoseDetection.minPartConfidence;
                break;
                case 'multi-pose':
                const allPoses = await net.estimatePoses(video, {
                    flipHorizontal: this.state.flipPoseHorizontal,
                    decodingMethod: 'multi-person',
                    maxDetections: guiState.multiPoseDetection.maxPoseDetections,
                    scoreThreshold: guiState.multiPoseDetection.minPartConfidence,
                    nmsRadius: guiState.multiPoseDetection.nmsRadius,
                });
        
                poses = poses.concat(allPoses);
                minPoseConfidence = +guiState.multiPoseDetection.minPoseConfidence;
                minPartConfidence = +guiState.multiPoseDetection.minPartConfidence;
                break;
            }
        
            working[index] = false;
        
            return {
                index: index,
                poses: poses,
                minPoseConfidence: minPoseConfidence,
                minPartConfidence: minPartConfidence,
            };
        }
        
        const drawVideoPose = async (video, poseResult, scale = 1, offset: [number, number] = [0, 0]) => {
            const ctx = this.ctx!;
            const guiState = this.state.guiState;

            if (guiState.output.showVideo) {
                ctx.save();
                ctx.translate(this.state.flipPoseHorizontal ? (scale * this.props.videoWidth) : 0, 0);
                ctx.scale(this.state.flipPoseHorizontal ? -1 : 1, 1);
                ctx.drawImage(
                    video,
                    (this.state.flipPoseHorizontal ? -1 : 1) * offset[0],
                    offset[1],
                    this.props.videoWidth * scale,
                    this.props.videoHeight * scale,
                );
                ctx.restore();
            }

            if (poseResult) {
                const poses = poseResult.poses;
                const minPoseConfidence = poseResult.minPoseConfidence;
                const minPartConfidence = poseResult.minPartConfidence;

                // For each pose (i.e. person) detected in an image, loop through the poses
                // and draw the resulting skeleton and keypoints if over certain confidence
                // scores

                poses.forEach(({score, keypoints}) => {
                    if (score >= minPoseConfidence) {
                        if (guiState.output.showPoints) {
                            drawKeypoints(keypoints, minPartConfidence, ctx, scale, offset);
                        }
                        if (guiState.output.showSkeleton) {
                            drawSkeleton(keypoints, minPartConfidence, ctx, scale, offset);
                        }
                        if (guiState.output.showBoundingBox) {
                            drawBoundingBox(keypoints, ctx, scale, offset);
                        }
                    }
                });
            }
        }

        function executeEveryFrame(callback) {
//            stats.begin();
            callback();
//            stats.end();

            requestAnimationFrame(() => {
                executeEveryFrame(callback);
            });
        }

        executeEveryFrame(() => {
            applyPosenetChange().then(() => {
                for (let i = 0; i < this.views.length; i++) {
                    getPoseResult(this.views[i].video, i).then((poses) => {
                        if (poses) {
                            Object.assign(this.views[poses.index], {poses: poses});
                        }
                    });
                }
            });
            ctx.clearRect(0, 0, this.props.videoWidth, this.props.videoHeight);
            this.views.forEach(({video, poses, scale, offset}) => {
                drawVideoPose(video, poses, scale, offset);
            });
        });
    }

    render() {
        return (
            <div>
                <canvas 
                    ref={this.canvas} 
                    width={this.props.videoWidth} 
                    height={this.props.videoHeight} 
                >
                    Canvas가 지원이 안 되는 것 같은데요 ㅠㅠㅠㅠ
                </canvas>
            </div>
        );
    }
}

export default Screen;