import * as posenet from '@tensorflow-models/posenet';

interface Config {
    algorithm: string,
    model: posenet.ModelConfig,
    flipPoseHorizontal: boolean,
    multiPose: {
        maxPoseDetections: number,
        minPartConfidence: number,
        nmsRadius: number,
    }
};

const defaultConfig : Config = {
  algorithm: 'single-pose',
  model: {
    architecture: 'MobileNetV1',
    multiplier: 0.75, // isMobile() ? 0.5 : 0.75,
    outputStride: 16,
    inputResolution: 250,
    quantBytes: 2,
  },
  flipPoseHorizontal: false,
  multiPose: {
    maxPoseDetections: 5,
    minPartConfidence: 0.1,
    nmsRadius: 30.0,
  },
};

// const defaultResNetMultiplier = 1.0;
// const defaultResNetStride = 32;
// const defaultResNetInputResolution = 250;

class PoseCalculator {
    video : HTMLVideoElement;
    poseNet : posenet.PoseNet;
    config : Config;
    modelInUse : boolean;
    resultPoses : posenet.Pose[][];

    constructor(video : HTMLVideoElement, config = defaultConfig) {
      this.video = video;
      this.config = config;
      this.modelInUse = true;
      posenet.load(config.model).then((poseNet) => {
        this.poseNet = poseNet;
        this.modelInUse = false;
      });
      this.resultPoses = [];
    }

    // 기존의 applyPosenetChange는 'on...Change'식의 함수로 사용할 것.

    getPoseResult = async () => {
      if (this.modelInUse) {
        return false;
      }

      this.modelInUse = true;

      let poses : posenet.Pose[][] = [];

      switch (this.config.algorithm) {
        case 'single-pose':
          const pose = await this.poseNet.estimatePoses(this.video, {
            flipHorizontal: this.config.flipPoseHorizontal,
            decodingMethod: 'single-person',
          });
          poses = poses.concat(pose);
          break;

        case 'multi-pose':
          const allPoses = await this.poseNet.estimatePoses(this.video, {
            flipHorizontal: this.config.flipPoseHorizontal,
            decodingMethod: 'multi-person',
            maxDetections: this.config.multiPose.maxPoseDetections,
            scoreThreshold: this.config.multiPose.minPartConfidence,
            nmsRadius: this.config.multiPose.nmsRadius,
          });

          poses = poses.concat(allPoses);
          break;
      }

      this.resultPoses = poses;
      this.modelInUse = false;

      return true;
    }
};

export default PoseCalculator;
