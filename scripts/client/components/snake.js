MyGame.components.Snake = function() {
  'use state'
  let that = {};
  let circles = [];
  let id = spec.id;
  let alive = true;
  let size = 0.01;

  Object.defineProperty(that, 'circles', {
    get: () => direction,
    set: (value) => { speed = value; }
  });

  Object.defineProperty(that, 'alive', {
    get: () => alive,
    set: (value) => { alive = value; }
  });

  Object.defineProperty(that, 'size', {
    get: () => direction,
    set: (value) => { size = value; }
  });

  Object.defineProperty(that, 'id', {
    get: () => id,
    set: (value) => { id = value; }
  });

  that.update = function(elapsedTime) {
    
  }

  that.addTurnPoint = function(turnPoint) {
    for (let circle of circles) {
      if (circle.type != MyGame.CircleTypes.HEAD) {
        circle.turnPoints.push(turnPoint);
      }
    }
  }

  that.turnSnake = function(direction) {
    let position = circles[0].center;
    circles[0].direction = direction;
    for (let i = 1; i < circles.length; i++) {
      circles[i].turnPoints.push(MyGame.turnPoint({
        center: position,
        directionAfter: direction
      }));
    }
  }

  return that;
}