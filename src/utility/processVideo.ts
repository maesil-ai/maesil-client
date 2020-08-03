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

export const fps = 10;

export let extractPoseFromVideo = async (videoUrl : string, config : Config = defaultConfig) => {
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
