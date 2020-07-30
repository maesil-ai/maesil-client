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

export type Pose = posenet.Pose;

// const defaultResNetMultiplier = 1.0;
// const defaultResNetStride = 32;
// const defaultResNetInputResolution = 250;

/**
 * PoseCalculator 클래스
 * @class PoseCalculator
 */
class PoseCalculator {
    video : HTMLVideoElement;
    poseNet : posenet.PoseNet;
    config : Config;
    readyToUse : boolean;
    modelInUse : boolean;
    resultPoses : posenet.Pose[];
    record : posenet.Pose[];

    /**
     * Creates an instance of PoseCalculator.
     * @param {HTMLVideoElement} video
     * @param {*} [config=defaultConfig]
     * @memberof PoseCalculator
     */
    constructor(video : HTMLVideoElement, config = defaultConfig) {
      this.video = video;
      this.config = config;
      this.modelInUse = true;
      this.readyToUse = false;
      this.resultPoses = [];
      this.record = [];
    }

    load = async () => {
      const poseNet = await posenet.load(this.config.model);
      this.poseNet = poseNet;
      this.modelInUse = false;
      this.readyToUse = true;
    }

    clearRecord = () => {
      this.record = [];
    }

    // 기존의 applyPosenetChange는 'on...Change'식의 함수로 사용할 것.

    getPoseResult = async () => {
      if (!this.readyToUse) {
        return false;
      }
      if (this.modelInUse) {
        if (this.record.length > 0) this.record.push(this.record[this.record.length-1]);
        return false;
      }

      this.modelInUse = true;

      let poses : posenet.Pose[] = [];
      
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

      if (poses[0]) this.record.push(poses[0]);

      this.resultPoses = poses;
      this.modelInUse = false;

      return true;
    }
};

export default PoseCalculator;
