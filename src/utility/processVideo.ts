import * as posenet from '@tensorflow-models/posenet';
import { PosenetConfig, defaultPosenetConfig } from 'utility/types';

export const fps = 10;

export let extractPoseFromVideo = async (videoUrl : string, config : PosenetConfig = defaultPosenetConfig) => {
  let video = document.createElement("video");
  video.src = videoUrl;
  
  let poseNet = await posenet.load(config.model);
  
  let extractPose = async () => {     
    let poseResult = await poseNet.estimatePoses(video, {
      flipHorizontal: config.flipPoseHorizontal,
      decodingMethod: 'single-person',
    });

    return poseResult[0];
  }

  return new Promise<posenet.Pose[]>((resolve, reject) => {
    let poses : posenet.Pose[] = [];

    let time = 0;
    video.load();
    video.addEventListener('loadeddata', () => {
      video.pause();
      video.currentTime = time;
    });

    video.addEventListener('seeked', async () => {
      let pose = await extractPose();
      poses.push(pose);
      console.log(time);
      time += 1 / fps;
      if (time < video.duration) video.currentTime = time;
      else {
        video.remove();
        resolve(poses);
      }
    });
  });
};
