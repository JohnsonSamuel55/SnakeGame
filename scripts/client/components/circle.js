MyGame.components.Circle = function() {
  let that = {};
  let center = {x: 0, y: 0};
  let direction = MyGame.directions.EAST;
  let turnPoints = [];
  let buffer = 0.0025;

  Object.defineProperty(that, 'center', {
    get: () => center
  });

  Object.defineProperty(that, 'direction', {
    get: () => direction
  });

  Object.defineProperty(that, 'turnPoints', {
    get: () => turnPoints
  });

  that.update = function(elapsedTime) {
    if (turnPoints.length > 0) {
      let turnPoint = turnPoints[turnPoints.length - 1];
      let distance = Math.sqrt((center.x - turnPoint.center.x) ** 2 + (center.y - turnPoint.center.y) ** 2);
      if (distance < buffer) {
        direction = turnPoints[turnPoints.length - 1].directionAfter;
        turnPoints.shift();
      }
    }
    center.x += speed * elapsedTime * Math.cos(direction);
    center.y += speed * elapsedTime * Math.sin(direction);
  }

  return that;
}