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
  	controlsButton.addEventListener("click", handleStartButtonClick);

    var creditsButton = document.getElementById("creditsButton");
  	creditsButton.addEventListener("click", handleStartButtonClick);

    function handleHighScoresButtonClick() {

    }

    function handleControlsButtonClick() {

    }

    function handleCreditsButtonClick() {
        
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