MyGame.renderers.BackgroundRenderer = function(graphics) {

  function render(backgrounds) {
    for (let background of backgrounds) {
      graphics.drawTexture(background.texture, background.center, 0, background.size);
    }
  }

  return {
    render
  };
}