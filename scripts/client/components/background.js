MyGame.components.Background = function(spec) {
  let center = {x: spec.center.x, y: spec.center.y};
  let size = {x: 1/9, y: 1/9};
  let texture = spec.texture;

  return {
    center,
    size,
    texture
  };
}