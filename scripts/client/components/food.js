MyGame.components.Food = function(spec) {
  let that = {};
  let center = {x: spec.center.x, y: spec.center.y};
  let type = spec.type;
  let value = spec.value;
  let size;
  switch (type) {
    case FoodTypes.MAPLE:
      size = .001;
      break;
    case FoodTypes.CHOCOLATE:
      size = .002;
      break;
    case FoodTypes.JELLY:
      size = .003;
      break;
    case FoodTypes.POWDERED:
      size = .004;
      break;
    case FoodTypes.CANDY:
      size = .005;
      break;
  }

  Object.defineProperty(that, 'center', {
    get: () => center
  });

  Object.defineProperty(that, 'type', {
    get: () => type
  });

  Object.defineProperty(that, 'value', {
    get: () => value
  });

  return that;
}