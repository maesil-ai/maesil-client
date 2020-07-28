import PoseCalculator from './poseCalculator';

function validateVideoFile(file) {
  if (file.type != 'video/mp4') {
    return false;
  }
  return true;
}

function getDuration(file) {
  let videoNode = document.createElement("video");
  let promise = new Promise(function(resolve, reject) {
    videoNode.addEventListener("loadedmetadata", function() {
      resolve(videoNode.duration);
    });
    videoNode.addEventListener("error", function() {
      reject(videoNode.error.message + "(" + videoNode.error.code + ")");
    });
  });

  const URL = window.URL || window.webkitURL;
  videoNode.src = URL.createObjectURL(file);

  return promise;
}

function validateVideoLength(file) {
  const MIN_TIME = 1;
  const MAX_TIME = 15;
  let ret = false;

  getDuration(file).then((duration) => {
    if (duration >= MIN_TIME && duration <= MAX_TIME)
      ret = true;
  });

  return ret;
}

function validateVideoSize(file) {
  const MAX_SIZE = 2 * 1024 * 1024; // 2메가 바이트
  if (file.size > MAX_SIZE) 
    return false;
  return true;
}

function validateHumanVideo(file) {
  const video = document.getElementById('video') as HTMLVideoElement;

  let calculator = new PoseCalculator(video);
  calculator.load();
  video.play();

  // 어떻게 종료 시키지
  function executeEveryFrame(callback) {
    callback();
    requestAnimationFrame(() => {
      executeEveryFrame(callback);
    });
  }

  executeEveryFrame(() => {calculator.getPoseResult();});



  

  return false;
}

/**
 * 올바른 비디오 파일을 올렸는지 검증
 * @export
 * @param {*} file 비디오 파일
 * @return {boolean} true when validation success
 */

export function validA (file: File) {
  if (!validateVideoFile(file)) return "The format is nor supported";
  if (!validateVideoSize(file)) return "Size must less than 2MiB";
  return "OK";
}

export function validateExcerciseFile(file : File) {
  // 0. 파일을 넘겨준다 가정  
  // 1. 비디오 파일인지 체크
  if (!validateVideoFile(file)) 
    return false;
  // 2. 비디오 파일의 크기를 체크
  if (!validateVideoSize(file)) 
    return false;

  // 2. 비디오 파일의 길이를 체크 (길이를 구해서 알려준다?)
  if (!validateVideoLength(file)) 
  return false;
  // 3. 비디오 파일에서 사람이 잘 측정되는지 체크 (pose를 구해서 알려준다?)
  if (!validateHumanVideo(file))
    return false;
  
  return true;
}