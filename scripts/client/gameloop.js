//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function(graphics, renderer, input, components) {
  'use strict';

  let lastTimeStamp = performance.now(),
      socket = io();
  
  function processInput(elapsedTime) {
  }
  
  function update(elapsedTime) {
  }
  
  function render() {
      
  }
  
  function gameLoop(time) {
      let elapsedTime = time - lastTimeStamp;
      lastTimeStamp = time;

      processInput(elapsedTime);
      update(elapsedTime);
      render();

      requestAnimationFrame(gameLoop);
  };
  
  function initialize() {
      console.log('game initializing...');

      //
      // Get the game loop started
      requestAnimationFrame(gameLoop);
  }

  return {
      initialize: initialize
  };

}(MyGame.graphics, MyGame.renderer, MyGame.input, MyGame.components));
