//------------------------------------------------------------------
//
// This function provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function(graphics, renderer, input, components) {
  'use strict';

  let lastTimeStamp = performance.now(),
      myKeyboard = input.Keyboard(),
      playerOthers = {},
      playerSelf = {
        model: components.Snake(),
        textures: [MyGame.assets['head'], MyGame.assets['body'], MyGame.assets['tail']]
      },
      messageHistory = Queue.create(),
      messageId = 1,
      socket = io(),
      networkQueue = Queue.create();

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

  function connectPlayerSelf(data){
    console.log("Self Connected");
    playerSelf.circles = data.circles;
    playerSelf.id = data.clientId;
    playerSelf.alive = true;
  }

  function connectPlayerOther(data){
    console.log("Other Player Connected");
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
    if (data.clientId == playerSelf.id) {
      playerSelf.addTurnPoint(data.turnPoint);
    }
    else {
      playerOthers[data.clientId].addTurnPoint(data.turnPoint);
    }
    //Update the self player based on data from the server
  }

  function updatePlayerOther(data){
    //Check that the player is in the playerOthers array
    //Then update based on data from server
  }

  function updatePlayerDeath(data) {
    if (data.id == playerSelf.clientId) {
      playerSelf.alive = false;
    }
    else {
      playerOthers[data.clientId].alive = false;
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
        }
    }
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

      //Create the keyboard handlers and register the keyboard commands
      


      //
      // Get the game loop started
      requestAnimationFrame(gameLoop);
  }

  return {
      initialize: initialize
  };

}(MyGame.graphics, MyGame.renderer, MyGame.input, MyGame.components));
