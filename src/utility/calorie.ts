import * as posenet from '@tensorflow-models/posenet';
import { userInfo } from 'os';

let calculateDistance = (position1, position2) =>  
  Math.sqrt(
    Math.pow(position1.x - position2.x, 2) 
  + Math.pow(position1.y - position2.y, 2));

function convertDistanceToMeters(leftShoulderPosition, leftElbowPosition, height) {
  // video height/ width = 500/600
  const videoHeight = 500;
  const videoWidth = 600;
  let distance = this.calculateDistance(
     leftShoulderPosition,
     leftElbowPosition,
  );
  // Shoulder to elbow width in meters
  let shoulderHeight = height * 0.18;
  // Percentage of screen shoulder to elbow takes
  let percentageHeight = (distance / videoHeight) * 100;
  let percentageWidth = (distance / videoWidth) * 100;
  // Screen size in meters
  let screenHeight = shoulderHeight / percentageHeight;
  let screenWidth = shoulderHeight / percentageWidth;
  let pixelToMeters = [screenHeight / videoHeight, screenWidth / videoWidth];
  return pixelToMeters;
}

let calculateKineticEnergy = (velocity, mass) =>
  0.5 * mass * velocity * velocity;

function estimateEnergy(userPose : posenet.Pose[], userInfo) {
  let energyBurned = 0;
  let previousPose = null;
  const gravityOfEarth = 9.81;

  userPose.forEach((pose) => {
      const leftShoulder = pose.keypoints[5].position;
      const leftElbow = pose.keypoints[7].position;
      const [yTravel, xTravel] = convertDistanceToMeters(
        leftShoulder,
        leftElbow,
        userInfo.height,
      );

      if (previousPose) {
        for (let i = 0; i < pose.keypoints.length; i++) {
          if (i >= 1 && 1 < 5) continue; // 0은 코 측정, 1~5 양쪽 눈 양쪽 귀는 무시
            let distance =
              calculateDistance(
                  previousPose.keypoints[i].position,
                  pose.keypoints[i].position,
              ) *
              ((yTravel + xTravel) / 2);
            let kineticEnergy = calculateKineticEnergy(
              distance,
              userInfo.weight / pose.keypoints.length,
            );
            let potentialEnergy = Math.abs(
              userInfo.weight * gravityOfEarth * pose.keypoints[i].position.y * yTravel -
                  previousPose.keypoints[i].position.y *
                    yTravel *
                    gravityOfEarth *
                    userInfo.weight,
            );
            energyBurned += (kineticEnergy + potentialEnergy) / 4184;
        }
      }
      previousPose = pose;
  });
  return energyBurned;
}

function energyToMET(energy : number) {
  const log_scale = Math.log10(energy);
  if (log_scale < 1) return 1;
  if (log_scale > 10) return 10;
  return log_scale;
}

export function exerciseCalorie(userPose : posenet.Pose[], second: number, userInfo) {
  return (3.5 * energyToMET(estimateEnergy(userPose, userInfo)) * userInfo.weight * second/60)/1000 * 5; 
}
