function turnPoint(spec) {
  'use strict';

  let center = {x: spec.center.x, y: spec.center.y};
  let directionAfter = spec.directionAfter;

  return {
    center,
    directionAfter
  };
}
if(typeof exports !== 'undefined'){
  module.exports.turnPoint = (spec) => turnPoint(spec);
}
else{
  this['turnPoint'] = {};
}