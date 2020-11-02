import PoseCalculator from 'utility/poseCalculator';

function validateVideoFile(file) {
  if (file.type != 'video/mp4') {
    return false;
  }
  return true;
}

function getDuration(video: HTMLVideoElement) {
  const promise = new Promise(function (resolve, reject) {
    video.addEventListener('loadedmetadata', function () {
      resolve(video.duration);
    });
    video.addEventListener('error', function () {
      reject(video.error.message + '(' + video.error.code + ')');
    });
  });

  return promise;
}

export async function validateVideoLength(video: HTMLVideoElement) {
  const MIN_TIME = 1;
  const MAX_TIME = 15;
  const duration = await getDuration(video);

  if (duration >= MIN_TIME && duration <= MAX_TIME) {
    return true;
  }

  return false;
}

function validateVideoSize(file) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10메가 바이트
  if (file.size > MAX_SIZE) {
    return false;
  }
  return true;
}

function validateHumanVideo(file) {
  const video = document.getElementById('video') as HTMLVideoElement;

  const calculator = new PoseCalculator(video);
  calculator.load();
  video.play();

  // 어떻게 종료 시키지
  function executeEveryFrame(callback) {
    callback();
    requestAnimationFrame(() => {
      executeEveryFrame(callback);
    });
  }

  executeEveryFrame(() => {
    calculator.getPoseResult();
  });

  return false;
}

/**
 * 올바른 비디오 파일을 올렸는지 검증
 * @export
 * @param {*} file 비디오 파일
 * @return {String} true when validation success
 */
export function validA(file: File) {
  if (!validateVideoFile(file)) return '동영상 파일만 올려주세요.';
//  if (!validateVideoSize(file)) return '최대 10메가바이트의 파일만 올릴 수 있습니다. 용량을 줄여주세요.';
  return 'ok';
}

// export function validateExcerciseFile(file : File) {
//   // 0. 파일을 넘겨준다 가정
//   // 1. 비디오 파일인지 체크
//   if (!validateVideoFile(file))
//     return false;
//   // 2. 비디오 파일의 크기를 체크
//   if (!validateVideoSize(file))
//     return false;

//   // 2. 비디오 파일의 길이를 체크 (길이를 구해서 알려준다?)
//   if (!validateVideoLength(file))
//   return false;
//   // 3. 비디오 파일에서 사람이 잘 측정되는지 체크 (pose를 구해서 알려준다?)
//   if (!validateHumanVideo(file))
//     return false;

//   return true;
// }
