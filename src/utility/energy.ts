class Energy {
    constructor() {}
    calculateDistance(position1, position2) {
       return Math.sqrt(
          Math.pow(position1['x'] - position2['x'], 2) +
             Math.pow(position1['y'] - position2['y'], 2),
       );
    }
    convertDistanceToMeters(leftShoulderPosition, leftElbowPosition, height) {
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
    calculateKineticEnergy(distance, mass) {
       let velocity = distance / 0.07;
       return Math.pow(0.5 * mass * velocity * velocity, 2);
    }
    calculatePotentialEnergy(height, mass) {
       return mass * height * 9.81;
    }
    calculateTotalEnergy(kinetic, potential) {
       return kinetic + potential;
    }
 }
 
 export default Energy;
 