MyGame.renderers.SnakeRenderer = function(graphics) {


  function render(model) {
    let circles = model.circles;
    for (let i = circles.length - 1; i >= 0; i--) {
      let circle = circles[i];
      if (circle.type == CircleTypes.HEAD) {
        graphics.drawTexture(MyGame.assets['head'], circle.center, circle.direction, {x: model.size, y: model.size});
      }
      else if (circle.type == CircleTypes.BODY) {
        graphics.drawTexture(MyGame.assets['body'], circle.center, circle.direction, {x: model.size, y: model.size});
      }
      else {
        graphics.drawTexture(MyGame.assets['tail'], circle.center, circle.direction, {x: model.size, y: model.size});
      }
    }
  }

  return {
    render
  };
}