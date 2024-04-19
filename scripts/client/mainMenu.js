    // Global variables for control keys
	var CONTROL_KEYS = {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		PAUSE: 80
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
    document.getElementById("leftKey").value = CONTROL_KEYS.LEFT;
    document.getElementById("upKey").value = CONTROL_KEYS.UP;
    document.getElementById("rightKey").value = CONTROL_KEYS.RIGHT;
    document.getElementById("downKey").value = CONTROL_KEYS.DOWN;
    document.getElementById("pauseKey").value = CONTROL_KEYS.PAUSE;

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
        CONTROL_KEYS.LEFT = document.getElementById("leftKey").value;
        CONTROL_KEYS.UP = document.getElementById("upKey").value;
        CONTROL_KEYS.RIGHT = document.getElementById("rightKey").value;
        CONTROL_KEYS.DOWN = document.getElementById("downKey").value;
        CONTROL_KEYS.PAUSE = document.getElementById("pauseKey").value;

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

		Game.play();
	}