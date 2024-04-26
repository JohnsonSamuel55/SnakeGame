//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function(graphics, renderer, input, components, systems) {
  'use strict';

  let lastTimeStamp = performance.now(),
      backgrounds = [],
      myKeyboard = input.Keyboard(),
      playerOthers = {},
      playerSelf = {
        model: components.Snake(),
        textures: [MyGame.assets['head'], MyGame.assets['body'], MyGame.assets['tail']]
      },
      messageHistory = Queue.create(),
      messageId = 1,
      socket = io(),
      networkQueue = Queue.create(),
      food = {},
      backgroundRenderer = renderer.BackgroundRenderer(graphics),
      snakeRenderer = renderer.SnakeRenderer(graphics),
      foodRenderer = renderer.AnimatedSprite({
        spriteSheet: MyGame.assets['food'],
        spriteCount: 6,
        spriteTime: [200, 200, 200, 200, 200, 200]
        }, graphics
      );
    //Load assets for particle system
    let particlesFire = systems.ParticleSystem({
            center: { x: 300, y: 300 },
            size: { mean: 10, stdev: 4 },
            speed: { mean: 50, stdev: 25 },
            lifetime: { mean: 4, stdev: 1 }
        },
        graphics);
    let particlesSmoke = systems.ParticleSystem({
            center: { x: 300, y: 300 },
            size: { mean: 10, stdev: 4 },
            speed: { mean: 50, stdev: 25 },
            lifetime: { mean: 4, stdev: 1 }
        },
        graphics);
    let renderFire = renderer.ParticleSystem(particlesFire, graphics, 'assets/fire.png');
    let renderSmoke = renderer.ParticleSystem(particlesSmoke, graphics, 'assets/smoke-2.png');

  socket.on(NetworkIds.CONNECT_ACK, data => {
    networkQueue.enqueue({
        type: NetworkIds.CONNECT_ACK,
        data: data
    });
  });

  socket.on(NetworkIds.CONNECT_OTHER, data =>{
    networkQueue.enqueue({
        type: NetworkIds.CONNECT_OTHER,
        data: data
    });
  });

  socket.on(NetworkIds.DISCONNECT_OTHER, data => {
    networkQueue.enqueue({
        type: NetworkIds.DISCONNECT_OTHER,
        data: data
    });
  });

  socket.on(NetworkIds.UPDATE_SELF, data => {
    networkQueue.enqueue({
      type: NetworkIds.UPDATE_SELF,
      data: data
    });
  });

  socket.on(NetworkIds.UPDATE_OTHER, data => {
    networkQueue.enqueue({
        type: NetworkIds.UPDATE_OTHER,
        data: data
    });
  });

  socket.on(NetworkIds.UPDATE_DEATH, data => {
    networkQueue.enqueue({
      type: NetworkIds.UPDATE_DEATH,
      data: data
    });
  });

  socket.on(NetworkIds.ADD_TURNPOINT, data => {
    networkQueue.enqueue({
      type: NetworkIds.ADD_TURNPOINT,
      data: data
    });
  });

  socket.on(NetworkIds.ADD_FOOD, data => {
    networkQueue.enqueue({
      type: NetworkIds.ADD_FOOD,
      data: data
    });
  });

  socket.on(NetworkIds.DELETE_FOOD, data => {
    networkQueue.enqueue({
      type: NetworkIds.DELETE_FOOD,
      data: data
    });
  });

  function connectPlayerSelf(data){
    console.log("Self Connected");
    playerSelf.model.circles = data.circles;
    console.log(data.clientId)
    playerSelf.model.id = data.clientId;
    playerSelf.model.alive = true;
    playerSelf.model.size = data.size;

    food = data.food;
    graphics.updateViewport({x: data.circles[0].center.x - (1 / 6), y: data.circles[0].center.y - (1 / 6)});
  }

  function connectPlayerOther(data){
    console.log("Other Player Connected: " + data.clientId);
    let model = components.SnakeRemote();
    model.state.circles = data.circles;
    model.state.alive = true;
    model.state.lastUpdate = performance.now();

    model.goal.circles = data.circles;
    model.goal.alive = true;
    model.goal.updateWindow = 0;
    //Setup other player's model from data and save it in
    //the playerOthers array
    playerOthers[data.clientId] = {
      model: model,
      textures: [MyGame.assets['head'], MyGame.assets['body'], MyGame.assets['tail']]
    };
  }

  function disconnectPlayerOther(data){
    //Remove the disconnected player from the playerOthers array
    console.log(data.clientId + " disconnected.")
    delete playerOthers[data.clientId];
  }

  function updatePlayerTurnPoints(data){
    if (data.clientId == playerSelf.model.id) {
      playerSelf.model.addTurnPoint(data.turnPoint);
    }
    else {
      playerOthers[data.clientId].model.addTurnPoint(data.turnPoint);
    }
    //Update the self player based on data from the server
  }

  function updatePlayerSelf(data) {
    playerSelf.model.circles = data.circles;
    graphics.updateViewport({x: data.circles[0].center.x - (1 / 6), y: data.circles[0].center.y - (1 / 6)})
  }

  function updatePlayerOther(data){
    //Check that the player is in the playerOthers array
    //Then update based on data from server
  }

  function addNewFood(data) {
    for (let newFood in data.newFood) {
      food[newFood] = data.newFood[newFood]
    }
  }

  function deleteFood(data) {
    for (let deleteFood in data.consumedFood) {
      delete food[deleteFood]
    }
  }

  function updatePlayerDeath(data) {
    if (data.clientId == playerSelf.model.id) {
      playerSelf.model.alive = false;
    }
    else {
      playerOthers[data.clientId].model.alive = false;
    }
  }
  
  function processInput(elapsedTime) {

    //Double buffering the queue to avoid asynchronously receiving
    //messages while processing
    let processMe = networkQueue;
    networkQueue = networkQueue = Queue.create();
    while(!processMe.empty){
        let message = processMe.dequeue();
        switch (message.type){
            case NetworkIds.CONNECT_ACK:
                connectPlayerSelf(message.data);
                break;
            case NetworkIds.CONNECT_OTHER:
                connectPlayerOther(message.data);
                break;
            case NetworkIds.DISCONNECT_OTHER:
                disconnectPlayerOther(message.data);
                break;
            case NetworkIds.UPDATE_SELF:
                updatePlayerSelf(message.data);
                break;
            case NetworkIds.UPDATE_OTHER:
                updatePlayerOther(message.data);
                break;
            case NetworkIds.UPDATE_DEATH:
                updatePlayerDeath(message.data);
                break;
            case NetworkIds.ADD_TURNPOINT:
                updatePlayerTurnPoints(message.data);
                break;
            case NetworkIds.ADD_FOOD:
                addNewFood(message.data);
                break;
            case NetworkIds.DELETE_FOOD:
                deleteFood(message.data);
                break;
        }
    }
  }
  
  function update(elapsedTime) {
    foodRenderer.update(elapsedTime);
    // graphics.updateViewport({x: graphics.viewport.x + .001, y: graphics.viewport.y + .001});
        // Tell the existing particles to update themselves
    particlesSmoke.update(elapsedTime);
    particlesFire.update(elapsedTime);
  }
  
  function render() {
    backgroundRenderer.render(backgrounds);
    for (let model in food) {
      foodRenderer.render(food[model]);
    }
    if (playerSelf.model.alive) {
      snakeRenderer.render(playerSelf.model);
    }
    for (let otherSnake in playerOthers) {
      snakeRenderer.render(playerOthers[otherSnake].model);
    }
    //Uncomment to render the particle effects
    //renderSmoke.render();
    //renderFire.render();
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

      //Create the keyboard handlers and register the keyboard commands
      
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          backgrounds.push(components.Background({center: {x: i / 9, y: j / 9}, texture: MyGame.assets['background']}));
        }
      }
      
      //
      // Get the game loop started
      requestAnimationFrame(gameLoop);
  }

  return {
      initialize: initialize
  };

}(MyGame.graphics, MyGame.renderers, MyGame.input, MyGame.components, MyGame.systems));
