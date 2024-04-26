let CircleTypes = require('../shared/circle-types');
let Directions = require('../shared/directions');
let Circle = require('./circle');

function createPlayer() {
  'use strict';

  let random = require("../shared/random");
  let circles = [];
  let id = "";
  let size = 0.035;
  let name = "";
  let score = 0;
  let pointsToIncreaseCircleCount = 10;
  let isInvinsible = true;
  let invinsibleTimer = 2000;
  let reportUpdate = false;

  function spawn() {
    let center = {x: .25, y: .5};
    circles.push(Circle.create({
        center: {x: center.x, y: center.y},
        type: CircleTypes.HEAD,
        turnPoints: [],
        direction: Directions.EAST,
        speed: 0.0001
      }));
    for (let i = 1; i < 4; i++) {
      circles.push(Circle.create({
        center: {x: center.x - size * i * .82, y: center.y},
        type: CircleTypes.BODY,
        turnPoints: [],
        direction: Directions.EAST,
        speed: 0.0001
      }));
    }
    circles.push(Circle.create({
      center: {x: center.x - size * 4 * .82, y: center.y},
      type: CircleTypes.TAIL,
      turnPoints: [],
      direction: Directions.EAST,
      speed: 0.0001
    }));
    isInvinsible = true;
    for (let i = 0; i < 5; i++) {
      circles[i].turnPoints.push({center: {x: .75, y: .5}, directionAfter: Directions.NORTH});
    }
  }

  function setName(newName) {
    name = newName;
  }

  function increaseScore(points) {
    score += points;
    if (score % pointsToIncreaseCircleCount === 0) {
      let previousCircle = circles[circles.length - 1];
      let newCircle = {
        center: {x: previousCircle.center.x - Math.cos(previousCircle.direction) * size * .82, y: previousCircle.center.y - Math.sin(previousCircle.direction) * size * .82},
        type: CircleTypes.TAIL,
        turnPoints: previousCircle.turnPoints,
        direction: previousCircle.direction,
        speed: 0.0001
      };
      previousCircle.setType(CircleTypes.BODY);
      circles.push(Circle.create(newCircle));
    }
  }

  function update(elapsedTime) {
    reportUpdate = true;
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
    set id(value) { id = value; },
    get size() { return size },
    get reportUpdate() { return reportUpdate },
    set reportUpdate(value) { reportUpdate = value; }
  }
}

module.exports.create = () => createPlayer();