import * as posenet from '@tensorflow-models/posenet';
import {PosenetConfig, defaultPosenetConfig, fps} from 'utility/types';

export const recordFps = fps;

export const extractPoseFromVideo = async (videoUrl : string, onProgress : (number) => void, config : PosenetConfig = defaultPosenetConfig) => {
  const video = document.createElement('video');
  video.src = videoUrl;
  video.width = 800;
  video.height = 600;

  const poseNet = await posenet.load(config.model);

  const extractPose = async () => {
    const poseResult = await poseNet.estimatePoses(video, {
      flipHorizontal: config.flipPoseHorizontal,
      decodingMethod: 'single-person',
    });

    return poseResult[0];
  };

  return new Promise<posenet.Pose[]>((resolve, reject) => {
    const poses : posenet.Pose[] = [];

    let time = 0;
    video.load();
    video.addEventListener('loadeddata', () => {
      video.pause();
      video.currentTime = time;
    });

    let scores = [];
    let idx = 0;
    const MINIMUM_THRESHOLD = 0.5;
    scores.push(0);
    video.addEventListener('seeked', async () => {
      const pose = await extractPose();
      poses.push(pose);
      scores.push(pose.score);
      
      idx++;
      scores[idx] += scores[idx-1];
      if (idx >= fps) {
        const meanScore = (scores[idx] - scores[idx-fps]) / fps;
        if (meanScore < MINIMUM_THRESHOLD) {
          reject();
        }
      }

      console.log(time);
      onProgress(time / video.duration);

      time += 1 / recordFps;
      if (time < video.duration) video.currentTime = time;
      else {
        video.remove();
        resolve(poses);
      }
    });
  });
};
