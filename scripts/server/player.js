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
  let alive = true;
  let speed = 0.00005

  function spawn() {
    let center = {x: random.nextRange(10, 90) / 100, y: random.nextRange(10, 90) / 100};
    circles.push(Circle.create({
        center: {x: center.x, y: center.y},
        type: CircleTypes.HEAD,
        turnPoints: [],
        direction: Directions.EAST,
        speed: speed
      }));
    for (let i = 1; i < 4; i++) {
      circles.push(Circle.create({
        center: {x: center.x - size * i * .82, y: center.y},
        type: CircleTypes.BODY,
        turnPoints: [],
        direction: Directions.EAST,
        speed: speed
      }));
    }
    circles.push(Circle.create({
      center: {x: center.x - size * 4 * .82, y: center.y},
      type: CircleTypes.TAIL,
      turnPoints: [],
      direction: Directions.EAST,
      speed: speed
    }));
    isInvinsible = true;
    // for (let i = 0; i < 5; i++) {
    //   circles[i].turnPoints.push({center: {x: .5, y: .5}, directionAfter: Directions.NORTH});
    // }
  }

  function setName(newName) {
    name = newName;
  }

  function increaseScore(points) {
    score += points;
    if (score % pointsToIncreaseCircleCount === 0 || points === 10) {
      let previousCircle = circles[circles.length - 1];
      let newCircle = {
        center: {x: previousCircle.center.x - Math.cos(previousCircle.direction) * size * .82, y: previousCircle.center.y - Math.sin(previousCircle.direction) * size * .82},
        type: CircleTypes.TAIL,
        turnPoints: previousCircle.turnPoints,
        direction: previousCircle.direction,
        speed: speed
      };
      previousCircle.setType(CircleTypes.BODY);
      circles.push(Circle.create(newCircle));
    }
  }

  function update(elapsedTime) {
    if (alive) {
      reportUpdate = true;
      invinsibleTimer -= elapsedTime;
      if (invinsibleTimer <= 0) {
        isInvinsible = false;
      }
      for (let circle in circles) {
        circles[circle].update(elapsedTime, circle);
      }
    }
  }

  function updateDirection(newDirection) {
    circles[0].direction = newDirection;
    for (let i = 1; i < circles.length; i++) {
      circles[i].turnPoints.unshift({center: {x: circles[0].center.x, y: circles[0].center.y}, directionAfter: newDirection});
    }
  }

  return {
    setName,
    increaseScore,
    update,
    spawn,
    updateDirection,
    get score() { return score; },
    get circles() { return circles; },
    get id() { return id; },
    set id(value) { id = value; },
    get size() { return size },
    get reportUpdate() { return reportUpdate },
    set reportUpdate(value) { reportUpdate = value; },
    get alive() { return alive; },
    set alive(value) { alive = value; }
  }
}

module.exports.create = () => createPlayer();