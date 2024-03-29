import store from 'store';
import { fps, Position, APIGetUserInfoData, Pose, Pose2D } from './types';

const calculatePixelDistance = (position1: Position, position2: Position) =>
  Math.sqrt(
    Math.pow(position1.x - position2.x, 2) +
      Math.pow(position1.y - position2.y, 2)
  );

const calculateVelocity = (
  position1: Position,
  position2: Position,
  time: number
) => calculatePixelDistance(position1, position2) / time;

const convertDistanceToMeters = (distance: number, height: number = 1.73) =>
  (height - 0.3322) / (4.3 * distance);

const calculateKineticEnergy = (velocity: number, mass: number) =>
  0.5 * mass * velocity * velocity;

function estimateEnergy(userPose: Pose[], userInfo: APIGetUserInfoData) {
  return 0;
  if (!("keypoints" in userPose[0])) return 0;
  let energyBurned = 0;
  let previousPose : Pose2D = null;
  const k = 1;

  userPose.forEach((pose) => {
    if (!("keypoints" in pose)) return 0;
    if (previousPose) {
      for (let i = 0; i < pose.keypoints.length; i++) {
        if (i >= 1 && 1 < 5) continue; // 0은 코 측정, 1~5 양쪽 눈 양쪽 귀는 무시
        const kineticEnergy = calculateKineticEnergy(
          k *
            calculateVelocity(
              pose.keypoints[i].position,
              previousPose.keypoints[i].position,
              1 / fps
            ),
          userInfo.weight / 13
        );
        // TO-DO implement this
        const potentialEnergy = 0;
        energyBurned += (kineticEnergy + potentialEnergy) / 4184;
      }
    } else {
      const leftShoulder = pose.keypoints[5].position;
      const leftElbow = pose.keypoints[7].position;
      const k = convertDistanceToMeters(
        calculatePixelDistance(leftShoulder, leftElbow),
        userInfo.height
      );
    }
    previousPose = pose;
  });
  return energyBurned;
}

function energyToMET(energy: number) {
  const log_scale = Math.log10(energy);
  if (log_scale < 1.5) return 1.5;
  if (log_scale > 10) return 10;
  return log_scale;
}

export function exerciseCalorie(userPose: Pose[], second: number) {
  const userInfo = store.getState().user.userInfo;
  return (
    (17.5 / 60000) *
    energyToMET(estimateEnergy(userPose, userInfo)) *
    userInfo.weight *
    second
  );
}
