import {poseSimilarity} from 'posenet-similarity';
import * as posenet from '@tensorflow-models/posenet';
/**
 * view에서 포즈를 추출하는 함수
 * @export
 * @param {*} view
 * @return {*} pose
 */
export function extractPose(view) {
  if (!view || !view.poses || !view.poses.poses) return null;
  // if (!view.poses.hasOwnProperty('poses')) return null;
  if (view.poses.poses.length > 1) {
    console.log('multi person detected');
    return null;
  }
  return view.poses.poses[0];
}

/**
 * 두 프레임을 받아서 유사도를 리턴
 * @export
 * @param {*} modelPose 모델 포즈
 * @param {*} userPose 유저 포즈
 * @return {*} score 유사도
 */
export function posePoseSimilarity(modelPose, userPose) {
  // 0일수록 비슷 아마 1넘어가기 힘들듯?
  // return poseSimilarity(modelPose, userPose, {strategy: 'weightedDistance'});
  // 0일수록 비슷 0~2사이 값
  // return poseSimilarity(modelPose, userPose, {strategy: 'cosineDistance'});
  // -1~1 사이 값, -1이면 방향 완전 반대, 1이면 완전 똑같음
  const bias = 0.5;
  const weight = 1 / (1 - bias);
  const similarity = poseSimilarity(modelPose, userPose, {strategy: 'cosineSimilarity'});
  if (typeof similarity == 'number') {
    return (((1+similarity)/2) - bias) * weight;
  }
  return 0;
}

/**
 *  views를 받아서 현재 프레임의 점수를 계산
 * @export
 * @param {*} views Screen.views (view[])
 * @return {*} 포즈 정확도 -1: 현재 모델이 제대로 측정 안됨, 0~1 값 점수
 */
export async function scorePoseSimilarity(views) {
  if (views.length !== 2) return -1;
  const modelPose= extractPose(views[0]);
  const userPose = extractPose(views[1]);
  if (modelPose == null) return -1;
  if (userPose == null) return 0;

  return posePoseSimilarity(modelPose, userPose);
}

/**
 * modelPose와 userPose의 배열을 받이서 전체 운동에 대한 점수를 return
 * @export
 * @param {*} modelPose posenet.Pose[],
 * @param {*} userPose posenet.Pose[]
 * @return {*} score
 */
export function exerciseScore(modelPose: posenet.Pose[],
    userPose: posenet.Pose[]) {
  let score = 0;

  const scoreMatrix = Array.from(Array(modelPose.length),
      () => new Array(userPose.length));

  const minimumCoverage = 0.7;
  for (let i = 0; i < modelPose.length; i++) {
    for (let j = 0; j < userPose.length; j++) {
      scoreMatrix[i][j] = posePoseSimilarity(modelPose[i], userPose[j]);
    }
  }

  // 대각선으로 보면서 평균 Sim이 제일 높은 얘를 찾음
  let startY = modelPose.length - 1;
  let startX = 0;
  for (; startX < userPose.length; (startY > 0 ? startY-- : startX++)) {
    let x = startX;
    let y = startY;
    let scoreSum = 0;
    const diagonalCnt = modelPose.length - startY;
    if (diagonalCnt / (modelPose.length) < minimumCoverage) {
      continue;
    }

    for (; y < modelPose.length; y++, x++) {
      scoreSum += scoreMatrix[y][x];
    }
    if (score < scoreSum / diagonalCnt) {
      score = scoreSum / diagonalCnt;
    }
  }
  return score;
}


/**
 *
 *
 * @export
 * @param {posenet.Pose[]} modelPose
 * @param {posenet.Pose[]} userPose
 * @return s
 */
export function checkOneTime(modelPose: posenet.Pose[],
  userPose: posenet.Pose[]) {
    const minScore = 0.7;
    const similarity = exerciseScore(modelPose, userPose);
    if (similarity < minScore) return true;
    return false;
}
