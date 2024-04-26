// ------------------------------------------------------------------
//
// Shared module between Nodejs and the browser that defines constants
// used for network communication.
//
// The use of the IIFE is to create a module that works on both the server
// and the client.
// Reference for this idea: https://caolan.org/posts/writing_for_node_and_the_browser.html
//
// ------------------------------------------------------------------
(function(exports) {
    'use strict';

    Object.defineProperties(exports, {
        'INPUT': {
            value: 'input',
            writable: false
        },
        'INPUT_EAST': {
            value: 'turn-east',
            writable: false
        },
        'INPUT_NORTHEAST': {
            value: 'turn-northeast',
            writable: false
        },
        'INPUT_NORTH': {
            value: 'turn-north',
            writable: false
        },
        'INPUT_NORTHWEST': {
            value: 'turn-northwest',
            writable: false
        },
        'INPUT_WEST': {
            value: 'turn-west',
            writable: false
        },
        'INPUT_SOUTHWEST': {
            value: 'turn-southwest',
            writable: false
        },
        'INPUT_SOUTH': {
            value: 'turn-south',
            writable: false
        },
        'INPUT_SOUTHEAST': {
            value: 'turn-southeast',
            writable: false
        },
        'CONNECT_ACK': {
            value: 'connect-ack',
            writable: false
        },
        'CONNECT_OTHER': {
            value: 'connect-other',
            writable: false
        },
        'DISCONNECT_OTHER': {
            value: 'disconnect-other',
            writable: false
        },
        'UPDATE_SELF': {
            value: 'update-self',
            writable: false
        },
        'UPDATE_OTHER': {
            value: 'update-other',
            writable: false
        },
        'ADD_TURNPOINT': {
            value: 'add-turnpoint',
            writable: false
        },
        'UPDATE_DEATH': {
            value: 'update-death',
            writable: false
        },
        'ADD_FOOD': {
            value: 'add_food',
            writable: false
        },
        'DELETE_FOOD': {
            value: 'delete-food',
            writable: false
        }
    });

})(typeof exports === 'undefined' ? this['NetworkIds'] = {} : exports);
