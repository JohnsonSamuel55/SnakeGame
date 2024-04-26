let random = require('../shared/random');
let Food = require('../shared/food-types');

function createFood(foodId, isCorpse, coords) {
  'use strict';
  let center = {x: random.nextDouble(), y: random.nextDouble()};
  let type;
  let value;
  let id = foodId;
  let size = .02
  if (!isCorpse) {
    switch (random.nextRange(0,4)) {
      case 0:
        type = Food.MAPLE;
        value = 2;
        break;
      case 1:
        type = Food.CHOCOLATE;
        value = 2;
        break;
      case 2:
        type = Food.JELLY;
        value = 2;
        break;
      case 3:
        type = Food.CANDY;
        value = 2;
        break;
      }
    }
  else {
    type = Food.POWDERED;
    size = .025;
    value = 10;
    center = {x: coords.x, y: coords.y};
  }

  return {
    center,
    type,
    value,
    id,
    size,
    coords
  };
}

module.exports.create = (foodId, isCorpse, center) => createFood(foodId, isCorpse, center);