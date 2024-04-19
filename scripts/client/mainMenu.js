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

    function handleControlsButtonClick() {

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
	}