let random = require('../shared/random');
let Food = require('../shared/food-types');

function createFood(foodId) {
  'use strict';
  let that = {};
  let center = {x: random.nextDouble(), y: random.nextDouble()};
  let type;
  let value;
  let id = foodId;
  let size = .01
  switch (random.nextRange(0,6)) {
    case 0:
      type = Food.MAPLE;
      value = 1;
      break;
    case 1:
      type = Food.CHOCOLATE;
      value = 2;
      break;
    case 2:
      type = Food.JELLY;
      value = 3;
      break;
    case 3:
      type = Food.POWDERED;
      value = 4;
      size = .03;
      break;
    case 4:
      type = Food.CANDY;
      value = 5;
      break;
  }

  return {
    center,
    type,
    value,
    id,
    size
  };
}

module.exports.create = () => createFood();