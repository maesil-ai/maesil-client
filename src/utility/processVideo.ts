import * as posenet from '@tensorflow-models/posenet';
import { PosenetConfig, defaultPosenetConfig, fps } from 'utility/types';

export const recordFps = fps;

export let extractPoseFromVideo = async (videoUrl : string, config : PosenetConfig = defaultPosenetConfig) => {
  let video = document.createElement("video");
  video.src = videoUrl;
  video.width = 800;
  video.height = 600;
  
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
      time += 1 / recordFps;
      if (time < video.duration) video.currentTime = time;
      else {
        video.remove();
        resolve(poses);
      }
    });
  });
};
