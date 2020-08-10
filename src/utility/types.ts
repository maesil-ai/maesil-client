import * as posenet from '@tensorflow-models/posenet';
import PoseCalculator from './poseCalculator';

export const fps = 30;

export type Pose = posenet.Pose;
export type PosenetModelConfig = posenet.ModelConfig;
export interface Position {
  x: number;
  y: number;
}

export interface PoseData {
  fps: number;
  poses: Pose[];
}

export interface PosenetConfig {
  algorithm: string;
  model: PosenetModelConfig;
  flipPoseHorizontal: boolean;
  multiPose: {
    maxPoseDetections: number;
    minPartConfidence: number;
    nmsRadius: number;
  };
}

export const defaultPosenetConfig: PosenetConfig = {
  algorithm: 'single-pose',
  model: {
    architecture: 'MobileNetV1',
    multiplier: 0.75, // isMobile() ? 0.5 : 0.75,
    outputStride: 16,
    inputResolution: 400,
    quantBytes: 4,
  },
  flipPoseHorizontal: false,
  multiPose: {
    maxPoseDetections: 5,
    minPartConfidence: 0.1,
    nmsRadius: 30.0,
  },
};

export interface PlayRecord {
  time: number;
  calorie: number;
  score: number;
}

export interface ScreenView {
  video: HTMLVideoElement;
  scale: number;
  offset: [number, number];
  poseData?: PoseData;
  calculator?: PoseCalculator;
}

export interface ExerciseData {
  id: number;
  name: string;
  description: string;
  playTime: string;
  userId: number;
  thumbUrl?: string;
  thumbGifUrl?: string;
  videoUrl?: string;
  skeleton?: string;
  reward: number;
  heartCount: number;
  viewCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  heart?: boolean;
}

export interface APIPostExerciseForm {
  exercise: Blob;
  title: string;
  description: string;
  play_time: number;
  thumbnail: Blob;
  reward: number;
  tag_id: number;
  level: number;
  skeleton: string;
}

export interface APIGetUserInfoData {
  user_id: number;
  email: string;
  password: string;
  nickname: string | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
  level: number | null;
  points: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const userInfoHasMetadata = (userInfo: APIGetUserInfoData) => {
  if (
    userInfo.nickname &&
    userInfo.gender &&
    userInfo.weight &&
    userInfo.height
  ) {
    return true;
  } else {
    return false;
  }
};
