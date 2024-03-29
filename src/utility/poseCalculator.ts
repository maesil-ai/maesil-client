import * as posenet from '@tensorflow-models/posenet';
import KalmanFilter from 'kalmanjs';
import { PosenetConfig, defaultPosenetConfig, PoseData2D, PoseData, Pose, Pose2D } from 'utility/types';

// const defaultResNetMultiplier = 1.0;
// const defaultResNetStride = 32;
// const defaultResNetInputResolution = 250;

/**
 * PoseCalculator 클래스
 * @class PoseCalculator
 */
class PoseCalculator {
  video: HTMLVideoElement;
  poseNet: posenet.PoseNet;
  config: PosenetConfig;
  readyToUse: boolean;
  modelInUse: boolean;
  resultPoses: Pose2D[];
  record: Pose2D[];
  filters: KalmanFilter[];
  poseData?: PoseData2D;
  useFilters: boolean;

  constructor(video: HTMLVideoElement, config = defaultPosenetConfig) {
    this.video = video;
    this.config = config;
    this.resultPoses = [];
    this.filters = Array(40);
    this.useFilters = true;
    this.clearRecord();
  }

  load = async (inputPoseData: PoseData2D | null = null) => {
    if (inputPoseData) {
      this.poseData = inputPoseData;
    } else {
      this.poseNet = await posenet.load(this.config.model);
      for (let i = 0; i < 40; i++) this.filters[i] = new KalmanFilter();
    }
    this.modelInUse = false;
    this.readyToUse = true;
  };

  clearRecord = () => {
    this.record = [];
    if (this.poseData) {
      return;
    }

    this.readyToUse = false;
    for (let i = 0; i < 40; i++) {
      this.filters[i] = new KalmanFilter();
    }
  };

  // 기존의 applyPosenetChange는 'on...Change'식의 함수로 사용할 것.

  getPoseResult = async (recordResult: boolean = true) => {
    if (!this.readyToUse) {
      return false;
    }

    if (this.modelInUse) {
      if (recordResult) {
        if (this.resultPoses.length > 0) this.record.push(this.resultPoses[0]);
      }
      return false;
    }
    let poses: Pose2D[] = [];

    if (this.poseData) {
      poses = poses.concat(
        this.poseData.poses[
          Math.floor(this.video.currentTime * this.poseData.fps)
        ]
      );
    } else {
      this.modelInUse = true;

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

      if (poses[0] && this.useFilters) {
        poses[0].keypoints.forEach((keypoint, i) => {
          keypoint.position.x = this.filters[2 * i].filter(keypoint.position.x);
          keypoint.position.y = this.filters[2 * i + 1].filter(
            keypoint.position.y
          );
        });
      }

      poses.forEach((pose) => pose.keypoints.forEach((keypoint) => {
        keypoint.position.x /= this.video.width;
        keypoint.position.y /= this.video.height;
      }));

      this.modelInUse = false;
    }
    if (poses[0]) {
      if (recordResult) this.record.push(poses[0]);
      this.resultPoses = poses;
    }
    return true;
  };
}

export default PoseCalculator;
