'use strict';

function turnPoint(spec) {
  let center = {x: spec.center.x, y: spec.center.y};
  let directionAfter = spec.directionAfter;

  return {
    center,
    directionAfter
  };
}

module.exports.turnPoint = (spec) => turnPoint(spec);