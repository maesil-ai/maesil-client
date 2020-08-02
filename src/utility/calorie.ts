
import * as posenet from '@tensorflow-models/posenet';

import Energy from './energy';
import { METHODS } from 'http';

export function estimateMET(userPose : posenet.Pose[], height, weight) {
  let energyBurned = 0;
  let previousPose = null;
  let timer = 0;
  const gravityOfEarth = 9.81;
  const energy = new Energy();

  userPose.forEach((pose) => {
      const leftShoulder = pose.keypoints[5].position;
      const leftElbow = pose.keypoints[7].position;
      const metersPerPixel = energy.convertDistanceToMeters(
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
              energy.calculateDistance(
                  previousPose.keypoints[i].position,
                  pose.keypoints[i].position,
              ) *
              ((yTravel + xTravel) / 2);
            let kineticEnergy = energy.calculateKineticEnergy(
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
      timer++;
  });
  return Math.log10(energyBurned);
}
export function exerciseCalorie(userPose : posenet.Pose[], time, height : number = 173, weight : number = 73) {
  const MET = estimateMET(userPose, height, weight);
  console.log(MET);
  return (3.5 * MET * weight * time/60)/1000 * 5; 
}
