let present = require('present');
let NetworkIds = require("../shared/network-ids");
let Queue = require('../shared/queue.js');
let Player = require('./player');
let Circle = require('./circle');
let Food = require('./food')
let Directions = require('../shared/directions')

const SIMULATION_UPDATE_RATE_MS = 50;
const STATE_UPDATE_RATE_MS = 100;
const MAX_FOOD = 150;
let food = {};
let newFood = {};
let quit = false;
let lastUpdate = 0;
let activeClients = {};
let inputQueue = Queue.create();


function processInput(elapsedTime) {   
    
    // Double buffering on the queue so we don't asynchronously receive inputs
    // while processing.
    let processMe = inputQueue;
    inputQueue = Queue.create();

    while (!processMe.empty) {
        let input = processMe.dequeue();
        let client = activeClients[input.clientId];
        client.lastMessageId = input.message.id;
        switch (input.message.type) {
            case NetworkIds.INPUT_EAST: 
                break;
            case NetworkIds.INPUT_NORTHEAST:
                break;
            case NetworkIds.INPUT_NORTH:
                break;
            case NetworkIds.INPUT_NORTHWEST:
                break;
            case NetworkIds.INPUT_WEST:
                break;
            case NetworkIds.INPUT_SOUTHWEST:
                break;
            case NetworkIds.INPUT_SOUTH:
                break;
            case NetworkIds.INPUT_SOUTHEAST:
                break;
        }
    }
}

function collided(obj1, obj2){

}

function update(elapsedTime, currentTime) {
}

function updateClients(elapsedTime) {
    
}


function gameLoop(currentTime, elapsedTime) {
    processInput(elapsedTime);
    update(elapsedTime, currentTime);
    updateClients(elapsedTime);

    if (!quit) {
        setTimeout(() => {
            let now = present();
            gameLoop(now, now - currentTime);
        }, SIMULATION_UPDATE_RATE_MS);
    }
}

function initializeSocketIO(httpServer) {
    let io = require('socket.io')(httpServer);

    // Notifies the connected players about the new player and vise versa.
    function notifyConnect(socket, newPlayer) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (newPlayer.clientId !== clientId) {
                client.socket.emit(NetworkIds.CONNECT_OTHER, {
                    clientId: newPlayer.clientId,
                    circles: newPlayer.circles,
                    alive: true
                });

                socket.emit(NetworkIds.CONNECT_OTHER, {
                    clientId: client.player.clientId,
                    circles: client.player.circles,
                    alive: client.player.alive
                });
            }
        }
    }

    function notifyDisconnect(playerId) {
        for (let clientId in activeClients) {
            let client = activeClients[clientId];
            if (playerId !== clientId) {
                client.socket.emit(NetworkIds.DISCONNECT_OTHER, {
                    clientId: playerId
                });
            }
        }
    }
    
    io.on('connection', function(socket) {
        console.log('Connection established: ', socket.id);
  
        // Create an entry in our list of connected clients
        
        let newPlayer = Player.create()
        newPlayer.id = socket.id;
        activeClients[socket.id] = {
            socket: socket,
            player: newPlayer
        };
        socket.emit(NetworkIds.CONNECT_ACK, {
            clientId: socket.id
        });

        socket.on(NetworkIds.INPUT, data => {
            inputQueue.enqueue({
                clientId: socket.id,
                message: data
            });
        });

        socket.on('disconnect', function() {
            delete activeClients[socket.id];
            notifyDisconnect(socket.id);
        });

        notifyConnect(socket, newPlayer);
    });
}

function initialize(httpServer) {
    activeClients = {};
    initializeSocketIO(httpServer);
    for (let i = 0; i < MAX_FOOD; i++) {
        food[i] = Food.create(i);
    }
    gameLoop(present(), 0);
}

function terminate() {
    this.quit = true;
}

module.exports.initialize = initialize;