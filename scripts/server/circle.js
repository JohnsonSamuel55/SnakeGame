'use strict';

function circle(spec) {
  let center = {x: spec.center.x, y: spec.center.y};
  let turnPoints = spec.turnPoints;
  let type = spec.type;
  let direction = spec.direction;
  let speed = spec.speed;
  let buffer = 0.0005;

  function update(elapsedTime) {
    let turnPoint = turnPoints[turnPoints.length - 1];
    let distance = Math.sqrt((center.x - turnPoint.center.x) ** 2 + (center.y - turnPoint.center.y) ** 2);
    if (distance > buffer) {
      direction = turnPoints[turnPoints.length - 1].directionAfter;
      turnPoints.shift();
    }
    center.x += speed * elapsedTime * Math.cos(direction);
    center.y += speed * elapsedTime * Math.sin(direction);
  }

  return {
    update,
    get center() { return center; },
    get type() { return type; }
  }
}

module.exports.create = (spec) => circle(spec)