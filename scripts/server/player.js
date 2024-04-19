let CircleTypes = require('../shared/circle-types');
let Directions = require('../shared/directions');
let Circle = require('./circle');

function createPlayer() {
  'use strict';

  let random = require("../shared/random");
  let circles = [];
  let id = null;
  let size = 0.0005;
  let name = "";
  let score = 0;
  let pointsToIncreaseCircleCount = 10;
  let isInvinsible = true;
  let invinsibleTimer = 2000;

  function spawn() {
    let center = {x: random.nextDouble(), y: random.nextDouble()};
    circles.push({
        center: {x: center.x, y: center.y},
        type: CircleTypes.HEAD,
        turnPoints: [],
        direction: Directions.EAST,
        speed: 0.01
      });
    for (let i = 1; i < 4; i++) {
      circles.push({
        center: {x: center.x - size * i, y: center.y},
        type: CircleTypes.BODY,
        turnPoints: [],
        direction: Directions.EAST,
        speed: 0.01
      });
    }
    circles.push({
      center: {x: center.x - size * i, y: center.y},
      type: CircleTypes.TAIL,
      turnPoints: [],
      direction: Directions.EAST,
      speed: 0.01
    });
    isInvinsible = true;
  }

  function setName(newName) {
    name = newName;
  }

  function increaseScore(points) {
    score += points;
    if (score % pointsToIncreaseCircleCount === 0) {
      let previousCircle = circles[circles.length - 1];
      let newCircle = {
        center: {x: previousCircle.center.x - Math.cos(previousCircle.direction) * size, y: previousCircle.center.y - Math.sin(previousCircle.direction) * size},
        type: CircleTypes.TAIL,
        turnPoints: previousCircle.turnPoints,
        direction: previousCircle.direction,
        speed: 0.01
      };
      previousCircle.setType(CircleTypes.BODY);
      circles.push(Circle.create(newCircle));
    }
  }

  function update(elapsedTime) {
    invinsibleTimer -= elapsedTime;
    if (invinsibleTimer <= 0) {
      isInvinsible = false;
    }
    for (let circle of circles) {
      circle.update(elapsedTime);
    }
  }

  return {
    setName,
    increaseScore,
    update,
    spawn,
    get score() { return score; },
    get circles() { return circles; },
    get id() { return id; },
    set id(value) { id = value; }
  }
}

module.exports.create = () => createPlayer();