'use strict';

function Directions() {
  return {
    "EAST": 0,
    "SOUTHEAST": Math.PI / 4,
    "SOUTH": Math.PI / 2,
    "SOUTHWEST": Math.PI * 3 / 4,
    "WEST": Math.PI,
    "NORTHWEST": Math.PI * 5 / 4,
    "NORTH": Math.PI * 3 / 2,
    "NORTHEAST": Math.PI * 7 / 4
  };
}

module.exports.Directions = () => Directions()