import * as posenet from '@tensorflow-models/posenet';

function calculateDistance(position1, position2) {
  return Math.sqrt(
     Math.pow(position1['x'] - position2['x'], 2) +
        Math.pow(position1['y'] - position2['y'], 2),
  );
}
function convertDistanceToMeters(leftShoulderPosition, leftElbowPosition, height) {
  // video height/ width = 500/600
  let distance = this.calculateDistance(
     leftShoulderPosition,
     leftElbowPosition,
  );
  // Shoulder to elbow width in meters
  let shoulderHeight = height * 0.18;
  // Percentage of screen shoulder to elbow takes
  let percentageHeight = (distance / 500) * 100;
  let percentageWidth = (distance / 600) * 100;
  // Screen size in meters
  let screenHeight = shoulderHeight / percentageHeight;
  let screenWidth = shoulderHeight / percentageWidth;
  let pixelToMeters = [screenHeight / 500, screenWidth / 600];
  return pixelToMeters;
}

function calculateKineticEnergy(distance, mass) {
  let velocity = distance / 0.07;
  return Math.pow(0.5 * mass * velocity * velocity, 2);
}

function estimateEnergy(userPose : posenet.Pose[], height, weight) {
  let energyBurned = 0;
  let previousPose = null;
  const gravityOfEarth = 9.81;

  userPose.forEach((pose) => {
      const leftShoulder = pose.keypoints[5].position;
      const leftElbow = pose.keypoints[7].position;
      const metersPerPixel = convertDistanceToMeters(
        leftShoulder,
        leftElbow,
        height,
      );
      const yTravel = metersPerPixel[0];
      const xTravel = metersPerPixel[1];

      if (!previousPose) {
        previousPose = pose;
      } else {
        for (let i = 4; i < pose.keypoints.length; i++) {
            let distance =
              calculateDistance(
                  previousPose.keypoints[i].position,
                  pose.keypoints[i].position,
              ) *
              ((yTravel + xTravel) / 2);
            let kineticEnergy = calculateKineticEnergy(
              distance,
              weight / pose.keypoints.length,
            );
            let potentialEnergy = Math.abs(
              weight * gravityOfEarth * pose.keypoints[i].position['y'] * yTravel -
                  previousPose.keypoints[i].position['y'] *
                    yTravel *
                    gravityOfEarth *
                    weight,
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

export function exerciseCalorie(userPose : posenet.Pose[], second: number, height : number = 173, weight : number = 73) {
  const energy = estimateEnergy(userPose, height, weight);
  return (3.5 * energyToMET(energy) * weight * second/60)/1000 * 5; 
}
