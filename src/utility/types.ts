import * as posenet from '@tensorflow-models/posenet';
import PoseCalculator from './poseCalculator';

export const fps = 30;

export type Pose = posenet.Pose;
export type PosenetModelConfig = posenet.ModelConfig;

export interface PoseData {
    fps: number,
    poses: Pose[],
};

export interface PosenetConfig {
    algorithm: string,
    model: PosenetModelConfig,
    flipPoseHorizontal: boolean,
    multiPose: {
        maxPoseDetections: number,
        minPartConfidence: number,
        nmsRadius: number,
    }
};

export const defaultPosenetConfig : PosenetConfig = {
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

export interface ExerciseView {
    id : number,
    name : string,
    thumbUrl : string,
    thumbGifUrl? : string,
    playTime : string,
    heart? : boolean,
};

export interface PlayRecord {
    time: number,
    calorie: number,
    score: number,
};

export interface ScreenView {
    video: HTMLVideoElement,
    scale: number,
    offset: [number, number],
    poseData?: PoseData,
    calculator?: PoseCalculator,
};

export interface APIGetExerciseData {
    exercise_id: number,
    title: string,
    description: string,
    play_time: string,
    user_id: number,
    thumb_url?: string,
    video_url?: string,
    skeleton?: string,
    reward: number,
    like_counts: number,
    view_counts: number,
    status: string,
    created_at: string,
    updated_at: string,
    isLike?: boolean,
};

export interface APIPostExerciseForm {
  exercise: Blob,
  title: string,
  description: string,
  play_time: number,
  thumbnail: Blob,
  reward: number,
  tag_id: number,
  level: number,
  skeleton: string,
}
