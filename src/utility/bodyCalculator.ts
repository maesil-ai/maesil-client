import * as bodyPix from '@tensorflow-models/body-pix';
import KalmanFilter from 'kalmanjs';
import { PoseData, Pose, defaultBodyPixMobileNetConfig} from 'utility/types';

// const defaultResNetMultiplier = 1.0;
// const defaultResNetStride = 32;
// const defaultResNetInputResolution = 250;

/**
 * PoseCalculator 클래스 with BodyPix
 * @class PoseCalculator
 */
class PoseCalculator {
  video: HTMLVideoElement;
  bodyPix: bodyPix.BodyPix;
  config;
  readyToUse: boolean;
  modelInUse: boolean;
  resultPoses: Pose[];
  record: Pose[];
  filters: KalmanFilter[];
  poseData?: PoseData;
  useFilters: boolean;

  constructor(video: HTMLVideoElement, config = defaultBodyPixMobileNetConfig) {
    this.video = video;
    this.config = config;
    this.resultPoses = [];
    this.filters = Array(40);
    this.useFilters = true;
    this.clearRecord();
  }

  load = async (inputPoseData: PoseData | null = null) => {
    if (inputPoseData) {
      this.poseData = inputPoseData;
    } else {
      this.bodyPix = await bodyPix.load(this.config.model);
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

  getPoseResult = async () => {
    if (!this.readyToUse) {
      return false;
    }

    if (this.modelInUse) {
      if (this.record.length > 0) this.record.push(this.resultPoses[0]);
      return false;
    }
    let poses: Pose[] = [];

    if (this.poseData) {
      poses = poses.concat(
        this.poseData.poses[
          Math.floor(this.video.currentTime * this.poseData.fps)
        ]
      );
    } else {
      this.modelInUse = true;
      switch (this.config.algorithm) {
        case 'multi-person-part':
          const segment = await this.bodyPix.segmentMultiPersonParts(this.video, {
            internalResolution: 'low',
            segmentationThreshold: 0.7,
            maxDetections: 5,
            scoreThreshold: 0.3,
            nmsRadius: 20,
            // numKeypointForMatching: 17,
            refineSteps: 10
          });
          poses = poses.concat(
            segment.map(a => a.pose)
          );
          break;
      }

      if (poses[0] && "keypoints" in poses[0] && this.useFilters) {
        poses[0].keypoints.forEach((keypoint, i) => {
          keypoint.position.x = this.filters[2 * i].filter(keypoint.position.x);
          keypoint.position.y = this.filters[2 * i + 1].filter(
            keypoint.position.y
          );
        });
      }

      this.modelInUse = false;
    }
    if (poses[0]) {
      this.record.push(poses[0]);
      this.resultPoses = poses;
    }
    return true;
  };
}

export default PoseCalculator;
