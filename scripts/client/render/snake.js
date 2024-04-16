MyGame.renderers.SnakeRenderer = function(graphics, snake) {


  function render() {
    for (let circle of snake.model.circles) {
      if (circle.type == MyGame.CircleTypes.HEAD) {
        graphics.drawTexture(snake.textures[0], circle.center, circle.direction, snake.model.size);
      }
      else if (circle.type == MyGame.CircleTypes.BODY) {
        graphics.drawTexture(snake.textures[1], circle.center, circle.direction, snake.model.size);
      }
      else {
        graphics.drawTexture(snake.textures[2], circle.center, circle.direction, snake.model.size);
      }
    }
  }
}