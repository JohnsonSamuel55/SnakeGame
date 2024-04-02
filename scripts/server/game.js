'use strict';

let present = require('present');

const SIMULATION_UPDATE_RATE_MS = 50;
let quit = false;
let activeClients = {};

function processInput(elapsedTime) {

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
    
    io.on('connection', function(socket) {
        console.log('Connection established: ', socket.id);

        socket.on('disconnect', function() {
            console.log(socket.id, "disconnected.")
            delete activeClients[socket.id];
        });
    });
}

function initialize(httpServer) {
    initializeSocketIO(httpServer);
    gameLoop(present(), 0);
}

function terminate() {
    this.quit = true;
}

module.exports.initialize = initialize;
