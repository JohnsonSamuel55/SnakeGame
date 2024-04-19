(function(exports) {
  'use strict';
  
  Object.defineProperties(exports, {
    "EAST": {
      value: 0,
      writable: false
    },
    "SOUTHEAST": {
      value: Math.PI / 4,
      writable: false
    },
    "SOUTH": {
      value: Math.PI / 2,
      writable: false
    },
    "SOUTHWEST": {
      value: Math.PI * 3 / 4,
      writable: false
    },
    "WEST": {
      value: Math.PI,
      writable: false
    },
    "NORTHWEST": {
      value: Math.PI * 5 / 4,
      writable: false
    },
    "NORTH": {
      value: Math.PI * 3 / 2,
      writable: false
    },
    "NORTHEAST": {
      value: Math.PI * 7 / 4,
      writable: false
    }
  });

})(typeof exports === 'undefined' ? this["Directions"] = {} : exports);