MyGame.components.SnakeRemote = function() {
  'use strict'
  let that = {};
  let size = 0.01;
  let state = {
    circles: [],
    alive: true
  }
  let goal = {
    circles: [],
    alive: true,
    updateWindow: 0
  }

  Object.defineProperty(that, 'state', {
    get: () => state
  });

  Object.defineProperty(that, 'goal', {
    get: () => goal
  });

  Object.defineProperty(that, 'size', {
    get: () => size
  });

  that.update = function(elapsedTime) {
    if (goal.updateWindow === 0) return;

    let updateFraction = elapsedTime / goal.updateWindow;
    if (updateFraction > 0) {
      
    }
  }

  that.addTurnPoint = function(turnPoint) {
    for (let circle of circles) {
      if (circle.type != MyGame.CircleTypes.HEAD) {
        circle.turnPoints.push(turnPoint);
      }
    }
  }

  return that;
}