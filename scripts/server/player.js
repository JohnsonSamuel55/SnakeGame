MyGame.server.Player = function(spec) {
  'use strict'

  let random = required("../shared/random");
  let circles = [];
  let id = spec.id;
  let size = spec.size;
  let name = "";
  let score = 0;
  let pointsToIncreaseCircleCount = spec.pointsToIncrease;
  let isInvinsible = true;
  let invinsibleTimer = 2000;

  function spawn() {
    let center = {x: random.nextDouble(), y: random.nextDouble()};
    circles.push({
        center: {x: center.x, y: center.y},
        type: MyGame.CircleTypes.HEAD,
        turnPoints: [],
        direction: MyGame.directions.EAST,
        speed: 0.01
      });
    for (let i = 1; i < 4; i++) {
      circles.push({
        center: {x: center.x - size * i, y: center.y},
        type: MyGame.CircleTypes.BODY,
        turnPoints: [],
        direction: MyGame.directions.EAST,
        speed: 0.01
      });
    }
    circles.push({
      center: {x: center.x - size * i, y: center.y},
      type: MyGame.CircleTypes.TAIL,
      turnPoints: [],
      direction: MyGame.directions.EAST,
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
        type: MyGame.CircleTypes.TAIL,
        turnPoints: previousCircle.turnPoints,
        direction: previousCircle.direction,
        speed: 0.01
      };
      previousCircle.setType(MyGame.CircleTypes.BODY);
      circles.push(MyGame.server.Circle(newCircle));
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