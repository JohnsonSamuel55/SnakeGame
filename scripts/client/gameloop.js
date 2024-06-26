//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function(graphics, renderer, input, components, systems) {
  'use strict';

  let lastTimeStamp = performance.now(),
      backgrounds = [],
      keysDown = [],
      myKeyboard = input.Keyboard(),
      playerOthers = {},
      playerSelf = {
        model: components.Snake(),
        textures: [MyGame.assets['head'], MyGame.assets['body'], MyGame.assets['tail']]
      },
      messageHistory = Queue.create(),
      newMessage,
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
    playerSelf.model.score = data.score;
    graphics.updateViewport({x: data.circles[0].center.x - (1 / 6), y: data.circles[0].center.y - (1 / 6)})
  }

  function updatePlayerOther(data){
    //Check that the player is in the playerOthers array
    //Then update based on data from server
    if (playerOthers.hasOwnProperty(data.clientId)) {
      console.log("updating other player")
      let model = playerOthers[data.clientId].model;
      model.state.circles = data.circles;
    }
  }

  function addNewFood(data) {
    for (let newFood in data.newFood) {
      food[newFood] = data.newFood[newFood]
    }
  }

  function deleteFood(data) {
    for (let deleteFood in data.consumedFood) {
      delete food[data.consumedFood[deleteFood]];
    }
  }

  function updatePlayerDeath(data) {
    if (data.clientId == playerSelf.model.id) {
      playerSelf.model.alive = false;
      showGameOverMessage(playerSelf.model.score, 0, 1);
    }
    else {
      playerOthers[data.clientId].model.alive = false;
    }
  }
  
  function processInput(elapsedTime) {

    //Double buffering the queue to avoid asynchronously receiving
    //messages while processing
    if (!!newMessage) {
      console.log(newMessage);
      socket.emit(NetworkIds.INPUT, {
        id: messageId++,
        elapsedTime: elapsedTime,
        type: newMessage
      });
    }
    newMessage = null;
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

      if(localStorage.getItem('CONTROL_KEYS_LEFT') == null || localStorage.getItem('CONTROL_KEYS_UP') == null ||
        localStorage.getItem('CONTROL_KEYS_RIGHT') == null ||localStorage.getItem('CONTROL_KEYS_DOWN') == null) {
        localStorage.setItem('CONTROL_KEYS_LEFT', 37);
        localStorage.setItem('CONTROL_KEYS_UP', 38);
        localStorage.setItem('CONTROL_KEYS_RIGHT', 39);
        localStorage.setItem('CONTROL_KEYS_DOWN', 40);
      }      
      for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
          if (i < 1 || i > 10 || j < 1 || j > 10) {
            backgrounds.push(components.Background({center: {x: j / 11, y: i / 11}, texture: MyGame.assets['black']}));
          }
          else {
            backgrounds.push(components.Background({center: {x: j / 11, y: i / 11}, texture: MyGame.assets['background']}));
          }
        }
      }
      
      //
      // Get the game loop started
      requestAnimationFrame(gameLoop);
  }

  window.addEventListener("keydown", (e) => {
    let left = localStorage.getItem('CONTROL_KEYS_LEFT');
    let up = localStorage.getItem('CONTROL_KEYS_UP');
    let right = localStorage.getItem('CONTROL_KEYS_RIGHT');
    let down = localStorage.getItem('CONTROL_KEYS_DOWN');

    function listsEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false;
      }

      let equal = false;
      arr1.forEach((value, index) => {
        equal = value == arr2[index];
      });
      return equal;
    }

    if (e.keyCode == left || e.keyCode == right || e.keyCode == up || e.keyCode == down) {
      if (keysDown.indexOf(e.keyCode) === -1) {
        keysDown.push(e.keyCode)
      }
    }

    if (listsEqual(keysDown, [up])) {
      newMessage = NetworkIds.INPUT_NORTH;
    }
    else if (listsEqual(keysDown, [right])) {
      newMessage = NetworkIds.INPUT_EAST;
    }
    else if (listsEqual(keysDown, [down])) {
      newMessage = NetworkIds.INPUT_SOUTH;
    }
    else if (listsEqual(keysDown, [left])) {
      newMessage = NetworkIds.INPUT_WEST;
    }
    else if (listsEqual(keysDown, [up, right]) || listsEqual(keysDown, [right, up])) {
      newMessage = NetworkIds.INPUT_NORTHEAST;
    }
    else if (listsEqual(keysDown, [up, left]) || listsEqual(keysDown, [left, up])) {
      newMessage = NetworkIds.INPUT_NORTHWEST;
    }
    else if (listsEqual(keysDown, [down, right]) || listsEqual(keysDown, [right, down])) {
      newMessage = NetworkIds.INPUT_SOUTHEAST;
    }
    else if (listsEqual(keysDown, [down, left]) || listsEqual(keysDown, [left, down])) {
      newMessage = NetworkIds.INPUT_SOUTHWEST;
    }
  });

  window.addEventListener("keyup", (e) => {
    let remove = keysDown.indexOf(e.keyCode);
    if (remove !== -1) {
      keysDown.splice(remove, 1);
    }

    let left = localStorage.getItem('CONTROL_KEYS_LEFT');
    let up = localStorage.getItem('CONTROL_KEYS_UP');
    let right = localStorage.getItem('CONTROL_KEYS_RIGHT');
    let down = localStorage.getItem('CONTROL_KEYS_DOWN');

    function listsEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false;
      }

      let equal = false;
      arr1.forEach((value, index) => {
        equal = value == arr2[index];
      });
      return equal;
    }

    if (listsEqual(keysDown, [up])) {
      newMessage = NetworkIds.INPUT_NORTH;
    }
    else if (listsEqual(keysDown, [right])) {
      newMessage = NetworkIds.INPUT_EAST;
    }
    else if (listsEqual(keysDown, [down])) {
      newMessage = NetworkIds.INPUT_SOUTH;
    }
    else if (listsEqual(keysDown, [left])) {
      newMessage = NetworkIds.INPUT_WEST;
    }
    else if (listsEqual(keysDown, [up, right]) || listsEqual(keysDown, [right, up])) {
      newMessage = NetworkIds.INPUT_NORTHEAST;
    }
    else if (listsEqual(keysDown, [up, left]) || listsEqual(keysDown, [left, up])) {
      newMessage = NetworkIds.INPUT_NORTHWEST;
    }
    else if (listsEqual(keysDown, [down, right]) || listsEqual(keysDown, [right, down])) {
      newMessage = NetworkIds.INPUT_SOUTHEAST;
    }
    else if (listsEqual(keysDown, [down, left]) || listsEqual(keysDown, [left, down])) {
      newMessage = NetworkIds.INPUT_SOUTHWEST;
    }
  });

  return {
      initialize: initialize
  };

}(MyGame.graphics, MyGame.renderers, MyGame.input, MyGame.components, MyGame.systems));
