let highlightedElements = [];

function createCustomTextField(bracketRound, gameNumber, byeGame) {
    let round = bracketRound;
    let container = document.createElement('div'); // Container for both fields
    container.classList.add('text-field-container');
    container.id = 'game' + gameNumber;
    let editingCheckbox = document.getElementById('editingMode');

    // Create two text fields and add them to the container
    for (let i = 0; i < 2; i++) {
        let inputField = document.createElement('input');
        inputField.type = 'text';

        inputField.addEventListener('click', function() {
            if (!editingCheckbox.checked) {
                if(highlightedElements.includes(this)) {
                    highlightedElements = highlightedElements.filter(item => item !== this);
                    this.classList.add('unhighlight');
                    this.classList.remove('highlight');
                } else {
                    highlightedElements.push(this);
                    this.classList.add('highlight');
                    this.classList.remove('unhighlight');
                    let self = this;
                    highlightedElements.forEach(function(element) {
                        if(self.parentElement == element.parentElement && self != element) {
                            highlightedElements = highlightedElements.filter(item => item !== element);
                            element.classList.add('unhighlight');
                            element.classList.remove('highlight');
                        }
                    });
                }
            }
        });
        if(round != 1) {
            inputField.readOnly = true;
        } else if(byeGame && i == 1) {
            inputField.value = "Bye";
        }
        container.appendChild(inputField); // Add each field to the container
    }
    return container; // Return the container with both fields
}

function createWinnerTextField(bracketRound, gameNumber) {
    let round = bracketRound;
    let container = document.createElement('div'); // Container for both fields
    container.classList.add('text-field-container');
    container.id = 'game' + gameNumber;
    let inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.readOnly = true;
    container.appendChild(inputField); // Add each field to the container
    return container;
}

document.getElementById('editingMode').addEventListener('click', function() {
    let container = document.getElementById('round1');
    if(container != null) {
        let textFields = container.querySelectorAll('input[type="text"]');
        let readOnly = !document.getElementById('editingMode').checked;
        textFields.forEach(function(input) {
            input.readOnly = readOnly;
        });
    }
});

document.getElementById('generateBtn').addEventListener('click', function() {
    let numTeams = parseInt(document.getElementById('numItems').value);
    // Ensure input is within bounds
    numTeams = Math.max(4, Math.min(32, numTeams));

    // Find the next power of 2
    let roundedTeams = Math.pow(2, Math.ceil(Math.log(numTeams) / Math.log(2)));

    // Calculate total rounds, adding 1 for the winner
    let totalRounds = Math.log(roundedTeams) / Math.log(2) + 1;

    // Clear previous content
    let bracketContainer = document.getElementById('bracketContainer');
    bracketContainer.innerHTML = '';

    let gameNumber = 1;

    // Generate divs for rounds
    let bracketTeams = roundedTeams;
    for(let round = 1; round <= totalRounds; round++) {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'round';
        roundDiv.id = `round${round}`;
        bracketContainer.appendChild(roundDiv);
        switch (roundedTeams) {
            case 4:
                roundDiv.classList.add('round4Elements');
                break;
            case 8:
                roundDiv.classList.add('round8Elements');
                break
            case 16:
                roundDiv.classList.add('round16Elements');
                break;
            case 32:
                roundDiv.classList.add('round32Elements');
                break;
            default:
                console.log("Switch case error line 111 of script.js")
        }
        let numByes = roundedTeams - numTeams;
        bracketTeams = bracketTeams/2;
        for(let x = bracketTeams; x >= 1; x--) {
            let byeGame = false;
            if(numByes > 0) {
                byeGame = true;
            }
            document.getElementById(`round${round}`).appendChild(createCustomTextField(round, gameNumber, byeGame));
            gameNumber++;
            numByes--;
        }
    }
    document.getElementById(`round${totalRounds}`).appendChild(createWinnerTextField(totalRounds, gameNumber));
    
    let canvas = document.getElementById('canvas');
    canvas.width = bracketContainer.offsetWidth;
    canvas.height = bracketContainer.offsetHeight;
    canvas.style.width = bracketContainer.offsetWidth + 'px';
    canvas.style.height = bracketContainer.offsetHeight + 'px';
    const ctx = canvas.getContext('2d');
    const canvasRect = canvas.getBoundingClientRect();

    // All text fields have been created, now add the event listener to assign winners
    let textFields = document.querySelectorAll('#bracketContainer input[type="text"]');
    textFields.forEach(function(textField) {
        textField.addEventListener('click', function() {
            for(let gameNumber = 1; gameNumber < roundedTeams; gameNumber++) {
                let gameContainer = document.getElementById(`game${gameNumber}`);
                let winnerOfGame = gameContainer.querySelectorAll(".highlight");
                if(winnerOfGame.length != 0) {
                    if(!Number.isInteger((roundedTeams + gameNumber) / 2)) {
                        document.getElementById(`game${Math.ceil((roundedTeams + gameNumber) / 2)}`).children[0].value = winnerOfGame[0].value;
                    } else {
                        document.getElementById(`game${Math.ceil((roundedTeams + gameNumber) / 2)}`).children[1].value = winnerOfGame[0].value;
                    }
                } else {
                    if(!Number.isInteger((roundedTeams + gameNumber) / 2)) {
                        document.getElementById(`game${Math.ceil((roundedTeams + gameNumber) / 2)}`).children[0].value = "";
                    } else {
                        document.getElementById(`game${Math.ceil((roundedTeams + gameNumber) / 2)}`).children[1].value = "";
                    }
                }
            }
        });
        textField.addEventListener('input', function() {
            for(let gameNumber = 1; gameNumber < roundedTeams; gameNumber++) {
                let gameContainer = document.getElementById(`game${gameNumber}`);
                let winnerOfGame = gameContainer.querySelectorAll(".highlight");
                if(winnerOfGame.length != 0) {
                    if(!Number.isInteger((roundedTeams + gameNumber) / 2)) {
                        document.getElementById(`game${Math.ceil((roundedTeams + gameNumber) / 2)}`).children[0].value = winnerOfGame[0].value;
                    } else {
                        document.getElementById(`game${Math.ceil((roundedTeams + gameNumber) / 2)}`).children[1].value = winnerOfGame[0].value;
                    }
                } else {
                    if(!Number.isInteger((roundedTeams + gameNumber) / 2)) {
                        document.getElementById(`game${Math.ceil((roundedTeams + gameNumber) / 2)}`).children[0].value = "";
                    } else {
                        document.getElementById(`game${Math.ceil((roundedTeams + gameNumber) / 2)}`).children[1].value = "";
                    }
                }
            }
        });

        // Functionality done, now adding lines between the brackets
        for(let gameNumber = 1; gameNumber < roundedTeams; gameNumber++) {
            let gameContainer = document.getElementById(`game${gameNumber}`).getBoundingClientRect();
            let nextGame = document.getElementById(`game${Math.ceil((roundedTeams + gameNumber) / 2)}`).getBoundingClientRect();
            let x1 = gameContainer.left - canvasRect.left + gameContainer.width / 2;
            let y1 = gameContainer.top - canvasRect.top + gameContainer.height / 2;
            let x2 = nextGame.left - canvasRect.left + nextGame.width / 2;
            let y2 = nextGame.top - canvasRect.top + nextGame.height / 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    });
});