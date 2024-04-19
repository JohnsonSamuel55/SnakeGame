'use strict'

let random = require('../shared/random');
let Food = require('../shared/food-types');

function createFood() {
  let that = {};
  let position = {x: random.nextDouble(), y: random.nextDouble()};
  let foodTypes = Food.Food();

}

module.exports.create = () => createFood();