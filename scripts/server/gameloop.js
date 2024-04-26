let present = require('present');
let NetworkIds = require("../shared/network-ids");
let Queue = require('../shared/queue.js');
let Player = require('./player');
let Circle = require('./circle');
let Food = require('./food')
let Directions = require('../shared/directions')

const SIMULATION_UPDATE_RATE_MS = 10;
const STATE_UPDATE_RATE_MS = 100;
const MAX_FOOD = 150;
let foodId = 0;
let food = {};
let newFood = {};
let consumedFood = {};
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

function collided(){
    let leftWall = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 1
    }
    let rightWall = {
        x1: 1,
        y1: 0,
        x2: 1,
        y2: 1
    }
    let topWall = {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0
    }
    let bottomWall = {
        x1: 0,
        y1: 1,
        x2: 1,
        y2: 1
    }

    function circlesOverlap(circle1, circle2) {
        // Calculate the distance between the center points of the circles
        const distance = Math.sqrt((circle2.x - circle1.x) ** 2 + (circle2.y - circle1.y) ** 2);
        // Sum of the radii of the circles
        const sumRadii = circle1.radius + circle2.radius;
    
        // If the distance between the centers is less than or equal to the sum of the radii, they overlap
        return distance <= sumRadii;
    }

    // Function to calculate the distance between a point (x, y) and a line defined by two points (x1, y1) and (x2, y2)
    function pointToLineDistance(x, y, x1, y1, x2, y2) {
        const numerator = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1);
        const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
        return numerator / denominator;
    }
    
    // Function to determine if a circle intersects a line
    function circleLineIntersect(circle, line) {
        const distance = pointToLineDistance(circle.x, circle.y, line.x1, line.y1, line.x2, line.y2);
        return distance <= circle.radius;
    }
    //for each client
    for(let clientId in activeClients){
        if (activeClients[clientId].player.alive) {
            //find the client's head
            let currentHead = activeClients[clientId].player.circles[0];
            let circle1 ={
                x: currentHead.center.x,
                y: currentHead.center.y,
                radius: activeClients[clientId].player.size / 2
            };
            let clientAlive = true;
            
            //if the client's head overlaps with a wall
            if (circleLineIntersect(circle1, leftWall) || circleLineIntersect(circle1, rightWall) || circleLineIntersect(circle1, topWall) || circleLineIntersect(circle1, bottomWall)){
                activeClients[clientId].player.alive = false;
                for(let id in activeClients){ 
                    activeClients[id].socket.emit(NetworkIds.UPDATE_DEATH, {
                        clientId: clientId
                    });
                }
                clientAlive = false;
            }
            if(clientAlive){
                //If the client's head overlaps with any part of another snake
                for(let otherId in activeClients){
                    if(activeClients[otherId].id !== activeClients[clientId].id){
                        let circles = activeClients[otherId].player.circles;
                        for( let circle in circles){
                            let circle2 = {
                                x: circle.center.x,
                                y: circle.center.y,
                                radius: activeClients[otherId].player.size / 2,
                                type: circle.type
                            };
                            if(circlesOverlap(circle1, circle2)){
                                activeClients[clientId].player.alive = false;
                                for(let id in activeClients){ 
                                    activeClients[id].socket.emit(NetworkIds.UPDATE_DEATH, {
                                        clientId: clientId
                                    });
                                }
                            }
                        }
                    }
                }
            }
            else {
                for (let circle of activeClients[clientId].player.circles) {
                    let newFoodObject = Food.create(foodId, true, circle.center);
                    newFood[foodId] = newFoodObject;
                    food[foodId] = newFoodObject;
                    foodId++;
                }
            }
            if (clientAlive){
                //if the client's head overlaps with a food the food is consumed by the client
                let toRemove = [];
                for (let piece in food){
    
                    let circle2 = {
                        x: food[piece].center.x,
                        y: food[piece].center.y,
                        radius: food[piece].size
                    }
                    if (circlesOverlap(circle2, circle1)){
                        activeClients[clientId].player.increaseScore(food[piece].value)
                        toRemove.push(piece); // Storing the id as key for quick lookup
                        consumedFood[piece] = piece;
                    }
                }
                // Remove items from the food array based on keys stored in toRemove
                toRemove.forEach((key) => delete food[key]);
            }
        }
    }
}

function update(elapsedTime, currentTime) {
    consumedFood = {};
    newFood = {};
    for (let clientId in activeClients){
        activeClients[clientId].player.update(elapsedTime);
    }

    collided();
    for (let i = Object.keys(food).length - 1; i < MAX_FOOD; i++) {
        let newFoodObject = Food.create(foodId, false);
        food[foodId] = newFoodObject;
        newFood[foodId] = newFoodObject;
        foodId++;
    }
}

function updateClients(elapsedTime) {
    for(let clientId in activeClients){
        let client = activeClients[clientId];
        let update = {
            clientId: clientId,
            lastMessageId: client.lastMessageId,
            circles: client.player.circles,
            updateWindow: lastUpdate
        };
        if (client.player.reportUpdate){
            client.socket.emit(NetworkIds.UPDATE_SELF, update);

            for(let otherId in activeClients){
                if(otherId !== clientId){
                    activeClients[otherId].socket.emit(NetworkIds.UPDATE_OTHER, update);
                }
            }
        }
    }

    if (Object.keys(consumedFood).length > 0) {
        for (let clientId in activeClients) {
            activeClients[clientId].socket.emit(NetworkIds.DELETE_FOOD, { consumedFood });
        }
    }

    if (Object.keys(newFood).length > 0) {
        for (let clientId in activeClients) {
            activeClients[clientId].socket.emit(NetworkIds.ADD_FOOD, { newFood })
        }
    }

    for (let clientId in activeClients) {
        activeClients[clientId].player.reportUpdate = false;
    }
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
            if (newPlayer.id !== clientId) {
                client.socket.emit(NetworkIds.CONNECT_OTHER, {
                    clientId: newPlayer.id,
                    circles: newPlayer.circles,
                    alive: true
                });

                socket.emit(NetworkIds.CONNECT_OTHER, {
                    clientId: client.player.id,
                    circles: client.player.circles
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
        
        let newPlayer = Player.create(socket.id);
        newPlayer.id = socket.id;
        newPlayer.spawn();
        activeClients[socket.id] = {
            socket: socket,
            player: newPlayer
        };
        socket.emit(NetworkIds.CONNECT_ACK, {
            clientId: socket.id,
            circles: newPlayer.circles,
            food: food,
            size: newPlayer.size
        });

        socket.on(NetworkIds.INPUT, data => {
            inputQueue.enqueue({
                clientId: socket.id,
                message: data
            });
        });

        socket.on('disconnect', function() {
            console.log(`disconnected ${socket.id}`);
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
        food[i] = Food.create(foodId++, false);
    }
    gameLoop(present(), 0);
}

function terminate() {
    this.quit = true;
}

module.exports.initialize = initialize;