	function updateHighScore(score) {
		var storedHighScores = localStorage.getItem('highScores');
		storedHighScores = JSON.parse(storedHighScores);
		storedHighScores = replaceAndSort(storedHighScores, score);
		localStorage.setItem('highScores', JSON.stringify(storedHighScores));
	}

	function replaceAndSort(array, newValue) {
		// Find the index of the minimum value
		var minIndex = array.indexOf(Math.min(...array));

		if(newValue < array[minIndex]) {
			return array;
		}
		
		// Replace the value at minIndex with newValue
		array[minIndex] = newValue;
		
		// Sort the array
		array.sort(function(a, b) {
			return b - a;
		});
	
		return array;
	}
	
	window.onload = function() {
		// Retrieve high scores from the browser storage
		var storedHighScores = localStorage.getItem('highScores');
		console.log(storedHighScores);
		if (storedHighScores) {
			// If high scores are stored, parse them
			var highScores = JSON.parse(storedHighScores);
		} else {
			// If no high scores are stored, initialize with five zeroes
			var highScores = [0, 0, 0, 0, 0];
			// Store the initial high scores
			localStorage.setItem('highScores', JSON.stringify(highScores));
		}

		var CONTROL_KEYS_LEFT = localStorage.getItem('CONTROL_KEYS_LEFT');
		var CONTROL_KEYS_UP = localStorage.getItem('CONTROL_KEYS_UP');
		var CONTROL_KEYS_RIGHT = localStorage.getItem('CONTROL_KEYS_RIGHT');
		var CONTROL_KEYS_DOWN = localStorage.getItem('CONTROL_KEYS_DOWN');
		console.log(CONTROL_KEYS_LEFT);
		console.log(CONTROL_KEYS_UP);
		console.log(CONTROL_KEYS_RIGHT);
		console.log(CONTROL_KEYS_DOWN);
		if(CONTROL_KEYS_LEFT === null || CONTROL_KEYS_UP === null || CONTROL_KEYS_RIGHT === null || CONTROL_KEYS_DOWN === null) {
			localStorage.setItem('CONTROL_KEYS_LEFT', CONTROL_KEYS.LEFT);
			localStorage.setItem('CONTROL_KEYS_UP', CONTROL_KEYS.UP);
			localStorage.setItem('CONTROL_KEYS_RIGHT', CONTROL_KEYS.RIGHT);
			localStorage.setItem('CONTROL_KEYS_DOWN', CONTROL_KEYS.DOWN);
		}
		else {
			CONTROL_KEYS.LEFT = CONTROL_KEYS_LEFT;
			CONTROL_KEYS.UP = CONTROL_KEYS_UP;
			CONTROL_KEYS.RIGHT = CONTROL_KEYS_RIGHT;
			CONTROL_KEYS.DOWN = CONTROL_KEYS_DOWN;
			
		}
	}
	
	// Global variables for control keys
	var CONTROL_KEYS = {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		PAUSE: 80
	};

	const keyMap = {
		// Alphabet keys
		'a': 65, 'b': 66, 'c': 67, 'd': 68, 'e': 69, 'f': 70, 'g': 71, 'h': 72, 'i': 73, 'j': 74, 
		'k': 75, 'l': 76, 'm': 77, 'n': 78, 'o': 79, 'p': 80, 'q': 81, 'r': 82, 's': 83, 't': 84, 
		'u': 85, 'v': 86, 'w': 87, 'x': 88, 'y': 89, 'z': 90,
	
		// Number keys
		'0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57,
	
		// Function keys
		'F1': 112, 'F2': 113, 'F3': 114, 'F4': 115, 'F5': 116, 'F6': 117, 'F7': 118, 'F8': 119,
		'F9': 120, 'F10': 121, 'F11': 122, 'F12': 123,
	
		// Control keys
		'Enter': 13, 'Escape': 27, 'Space': 32, 'Tab': 9, 'Backspace': 8, 'Shift': 16, 'Control': 17,
		'Alt': 18, 'CapsLock': 20, 'Meta': 91,
	
		// Arrow keys
		'ArrowUp': 38, 'ArrowDown': 40, 'ArrowLeft': 37, 'ArrowRight': 39,
	
		// Special keys
		'Insert': 45, 'Delete': 46, 'Home': 36, 'End': 35, 'PageUp': 33, 'PageDown': 34,
	
		// Symbol keys
		'`': 192, '-': 189, '=': 187, '[': 219, ']': 221, '\\': 220, ';': 186, '\'': 222,
		',': 188, '.': 190, '/': 191,
	
		// Numpad keys
		'Num0': 96, 'Num1': 97, 'Num2': 98, 'Num3': 99, 'Num4': 100, 'Num5': 101,
		'Num6': 102, 'Num7': 103, 'Num8': 104, 'Num9': 105,
		'NumMultiply': 106, 'NumAdd': 107, 'NumSubtract': 109, 'NumDecimal': 110, 'NumDivide': 111
	};
	
	const reversedKeyMap = {
		65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 
		75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 
		85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',
	
		48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
	
		112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6', 118: 'F7', 119: 'F8',
		120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
	
		13: 'Enter', 27: 'Escape', 32: 'Space', 9: 'Tab', 8: 'Backspace', 16: 'Shift', 17: 'Control',
		18: 'Alt', 20: 'CapsLock', 91: 'Meta',
	
		38: 'ArrowUp', 40: 'ArrowDown', 37: 'ArrowLeft', 39: 'ArrowRight',
	
		45: 'Insert', 46: 'Delete', 36: 'Home', 35: 'End', 33: 'PageUp', 34: 'PageDown',
	
		192: '`', 189: '-', 187: '=', 219: '[', 221: ']', 220: '\\', 186: ';', 222: '\'',
		188: ',', 190: '.', 191: '/',
	
		96: 'Num0', 97: 'Num1', 98: 'Num2', 99: 'Num3', 100: 'Num4', 101: 'Num5',
		102: 'Num6', 103: 'Num7', 104: 'Num8', 105: 'Num9',
		106: 'NumMultiply', 107: 'NumAdd', 109: 'NumSubtract', 110: 'NumDecimal', 111: 'NumDivide'
	};
	
    
    var startButton = document.getElementById("startButton");
  	startButton.addEventListener("click", handleStartButtonClick);

    var highScoresButton = document.getElementById("highScoresButton");
    highScoresButton.addEventListener("click", handleHighScoresButtonClick);

    var controlsButton = document.getElementById("controlsButton");
  	controlsButton.addEventListener("click", handleControlsButtonClick);

    var creditsButton = document.getElementById("creditsButton");
  	creditsButton.addEventListener("click", handleCreditsButtonClick);

function handleHighScoresButtonClick() {
	document.getElementById("mainMenu").style.display = "none";

	var highScoresScreen = document.getElementById("highScoresScreen");
	highScoresScreen.style.display = "block";

	// Retrieve high scores from the browser storage
    var storedHighScores = localStorage.getItem('highScores');

    if (storedHighScores) {
        // If high scores are stored, parse them
        var highScores = JSON.parse(storedHighScores);
    } else {
        // If no high scores are stored, initialize with five zeroes
        var highScores = [0, 0, 0, 0, 0];
        // Store the initial high scores
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }

	// Display the high scores in the screen
    var highScoresList = document.getElementById("highScoresList");
    highScoresList.innerHTML = ''; // Clear previous list

    for (var i = 0; i < highScores.length; i++) {
        var listItem = document.createElement('li');
        listItem.textContent = "High Score " + (i + 1) + ": " + highScores[i];
        highScoresList.appendChild(listItem);
    }

	function handleKeyPress(event) {
        if (event.keyCode === 27) { // Check if the pressed key is the Escape key
            // Hide the controls screen
            highScoresScreen.style.display = "none";

            // Show the main menu again
            document.getElementById("mainMenu").style.display = "block";

            // Remove the event listener
            document.removeEventListener("keydown", handleKeyPress);
        }
    }

    // Add event listener for keydown event
    document.addEventListener("keydown", handleKeyPress);
}

    var selectedInput = null;

function setControlKey(inputId) {
    selectedInput = document.getElementById(inputId);
    selectedInput.value = 'Press a key';
    document.addEventListener("keydown", handleControlKey);
}

function handleControlKey(event) {
    if (selectedInput) {
        selectedInput.value = event.key;
        selectedInput = null;
        document.removeEventListener("keydown", handleControlKey);
    }
}

function handleControlsButtonClick() {
    // Hide the main menu
    document.getElementById("mainMenu").style.display = "none";
    
    // Display the controls screen
    var controlsScreen = document.getElementById("controlsScreen");
    controlsScreen.style.display = "block";

    // Populate input fields with current control keys
    document.getElementById("leftKey").value = reversedKeyMap[CONTROL_KEYS.LEFT];
    document.getElementById("upKey").value = reversedKeyMap[CONTROL_KEYS.UP];
    document.getElementById("rightKey").value = reversedKeyMap[CONTROL_KEYS.RIGHT];
    document.getElementById("downKey").value = reversedKeyMap[CONTROL_KEYS.DOWN];
    document.getElementById("pauseKey").value = reversedKeyMap[CONTROL_KEYS.PAUSE];

    // Function to handle the escape key press
    function handleKeyPress(event) {
        if (event.keyCode === 27) { // Check if the pressed key is the Escape key
            // Hide the controls screen
            controlsScreen.style.display = "none";

            // Show the main menu again
            document.getElementById("mainMenu").style.display = "block";

            // Remove the event listener
            document.removeEventListener("keydown", handleKeyPress);
        }
    }

    // Add event listener for keydown event
    document.addEventListener("keydown", handleKeyPress);

    // Save button click handler
    var saveControlsButton = document.getElementById("saveControlsButton");
    saveControlsButton.addEventListener("click", function() {
        // Update control keys based on input fields
        CONTROL_KEYS.LEFT = keyMap[document.getElementById("leftKey").value];
        CONTROL_KEYS.UP = keyMap[document.getElementById("upKey").value];
        CONTROL_KEYS.RIGHT = keyMap[document.getElementById("rightKey").value];
        CONTROL_KEYS.DOWN = keyMap[document.getElementById("downKey").value];
        CONTROL_KEYS.PAUSE = keyMap[document.getElementById("pauseKey").value];

		localStorage.setItem('CONTROL_KEYS_LEFT', CONTROL_KEYS.LEFT);
		localStorage.setItem('CONTROL_KEYS_UP', CONTROL_KEYS.UP);
		localStorage.setItem('CONTROL_KEYS_RIGHT', CONTROL_KEYS.RIGHT);
		localStorage.setItem('CONTROL_KEYS_DOWN', CONTROL_KEYS.DOWN);

        // Hide the controls screen
        controlsScreen.style.display = "none";

        // Show the main menu again
        document.getElementById("mainMenu").style.display = "block";

        // Remove the event listener
        document.removeEventListener("keydown", handleKeyPress);
    });
}


    function handleCreditsButtonClick() {
		// Hide the main menu
		document.getElementById("mainMenu").style.display = "none";
		
		// Display the credits screen
		var creditsScreen = document.getElementById("creditsScreen");
		creditsScreen.style.display = "block";
	
		// Function to handle the escape key press
		function handleKeyPress(event) {
			if (event.keyCode === 27) { // Check if the pressed key is the Escape key
				// Hide the credits screen
				creditsScreen.style.display = "none";
	
				// Show the main menu again
				document.getElementById("mainMenu").style.display = "block";
	
				// Remove the event listener
				document.removeEventListener("keydown", handleKeyPress);
			}
		}
	
		// Add event listener for keydown event
		document.addEventListener("keydown", handleKeyPress);
	}
	
	

	// Function to handle the start button click
	function handleStartButtonClick() {
		document.getElementById("gameCanvas").style.display = "block"; // Make gameCanvas visible
	
		// Hide each button
		var buttons = document.querySelectorAll("#mainMenu button");
		buttons.forEach(function(button) {
		  button.style.display = "none";
		});

		MyGame.loader();
		
		// Function to handle the escape key press
		function handleKeyPress(event) {
			if (event.keyCode === 27) { // Check if the pressed key is the Escape key
				// Hide the credits screen
				document.getElementById("gameCanvas").style.display = "none";
	
				// Show each button
				var buttons = document.querySelectorAll("#mainMenu button");
				buttons.forEach(function(button) {
				button.style.display = ""; // Sets display property to default (block or inline-block)
				});

	
				// Remove the event listener
				document.removeEventListener("keydown", handleKeyPress);
			}
		}
	
		// Add event listener for keydown event
		document.addEventListener("keydown", handleKeyPress);
	}

	