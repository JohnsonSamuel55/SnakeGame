let random = require('../shared/random');
let Food = require('../shared/food-types');

function createFood(foodId) {
  'use strict';
  let that = {};
  let center = {x: random.nextDouble(), y: random.nextDouble()};
  let type;
  let value;
  let id = foodId;
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
      break;
    case 4:
      type = Food.CANDY;
      value = 5;
      break;
  }

  Object.defineProperty(that, "center", {
    get: () => center
  });

  Object.defineProperty(that, "type", {
    get: () => type
  });

  Object.defineProperty(that, "value", {
    get: () => value
  });

  Object.defineProperty(that, "id", {
    get: () => id
  });

  return that;
}

module.exports.create = () => createFood();