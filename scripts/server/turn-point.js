MyGame.server.turnPoint = function(spec) {
  let center = {x: spec.center.x, y: spec.center.y};
  let directionAfter = spec.directionAfter;

  return {
    center,
    directionAfter
  };
}