function circle(spec) {
  'use strict';
  
  let center = {x: spec.center.x, y: spec.center.y};
  let turnPoints = spec.turnPoints;
  let type = spec.type;
  let direction = spec.direction;
  let speed = spec.speed;
  let buffer = 0.002;

  function update(elapsedTime, index) {
    if (turnPoints.length > 0) {
      let turnPoint = turnPoints[turnPoints.length - 1];
      let distance = Math.sqrt((center.x - turnPoint.center.x) ** 2 + (center.y - turnPoint.center.y) ** 2);
      if (distance < buffer) {
        direction = turnPoints[turnPoints.length - 1].directionAfter;
        console.log(direction);
        turnPoints.shift();
      }
    }
    center.x += speed * elapsedTime * Math.cos(direction);
    center.y += speed * elapsedTime * Math.sin(direction);
  }

  function setType(newType) {
    type = newType;
  }

  return {
    update,
    setType,
    get center() { return center; },
    get type() { return type; },
    get direction() { return direction; },
    set direction(value) { direction = value; },
    get turnPoints() { return turnPoints; }
  }
}

module.exports.create = (spec) => circle(spec)