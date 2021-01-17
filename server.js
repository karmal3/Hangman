var express = require('express');
var app = express();
var serv = require('http').Server(app);

serv.listen(8080);
console.log("Server started");

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    console.log('socket connection');
    //----------------------------------------------------------------
    //var words = ['Application', 'Internship', 'Programing'];
    var words = ['Obuolys', 'Medis', 'Ananasas', 'Automobilis', 'Sraigtasparnis', 'Auksas',
        'Kompiuteris', 'Telefonas', 'Monitorius'];
    var word = words[Math.floor(Math.random() * words.length)];
    var answer = [];
    var wrongLetters = [];
    var message = "";
    var errorMsg = "";
    var popMessage = "";
    var lettersLeft = word.length;
    var life = 10;
    var goodGuess = false;

    // Changes randomly picked word letters to empty.
    for (let i = 0; i < word.length; i++) {
        answer[i] = "";
        message = answer.join(" ");
    }
    // Sends changes to client.
    socket.emit('serverMsg', {
        msg: message.toUpperCase(),
        error: errorMsg,
        lifeMsg: life,
        wrongLtrs: wrongLetters,
        popMsg: popMessage,
    });
    // Gets guessed letter from client side.
    socket.on('getLetter', function (data) {
        errorMsg = "";
        //Checks if there is still letters left to guess.
        if (lettersLeft > 0) {
            var playerGuess = data.ltr; // Assigning client guess to variable.
            if (playerGuess.length === 0) {
                errorMsg = "You entered nothing, please enter a letter";
                goodGuess = true;
            } else if (!isNaN(playerGuess)) {
                errorMsg = "You entered a number, please enter a letter";
                goodGuess = true;
            } else if (playerGuess.length > 1) {
                errorMsg = "Please enter a single letter";
                goodGuess = true;
            } else {
                // Checking if client guessed letter is not already guessed. 
                // If it's not, then going through word loop to check if letter exist in the word.
                if (answer.indexOf(playerGuess) === -1) {
                    for (let j = 0; j < word.length; j++) {
                        if (word[j].toUpperCase() === playerGuess.toUpperCase()) {
                            answer[j] = playerGuess;
                            lettersLeft--;
                            goodGuess = true;
                        }
                    }
                }else {
                    goodGuess = true;
                    errorMsg = "You have already guessed this letter";
                }
            }
        }
       
        message = answer.join(" ");
        if (lettersLeft === 0) {
            popMessage = "Congratulations!";
        }
        // Checks if guess was wrong
        if (goodGuess === false) {
            // If it was, then check if wrong guessed letter already was not guessed
            // If it was not, then substract one life(try) and push that wrong letter 
            // to wrongLetter list
            if (wrongLetters.indexOf(playerGuess) === -1) {
                life--;
                wrongLetters.push(playerGuess);
            } else {
                errorMsg = "You have already guessed this letter";
            }
            if (life === 0 && lettersLeft > 0) {
                popMessage = "You lost. Try again. The word was - " + word;
            }
        }
        goodGuess = false;

        // Sends changes to client.
        socket.emit('serverMsg', {
            msg: message.toUpperCase(),
            error: errorMsg,
            lifeMsg: life,
            wrongLtrs: wrongLetters,
            popMsg: popMessage,
        });

    });
    //resets game variables to starting position.
    socket.on('playAgain', function (data) {
        if (data.playAgain === true) {
            //words = ['Application', 'Internship', 'Programing'];
            words = ['Obuolys', 'Medis', 'Ananasas', 'Automobilis', 'Sraigtasparnis', 'Auksas',
                'Kompiuteris', 'Telefonas', 'Monitorius'];
            word = words[Math.floor(Math.random() * words.length)];
            answer = [];
            wrongLetters = [];
            message = "";
            errorMsg = "";
            popMessage = "";
            lettersLeft = word.length;
            life = 10;
            goodGuess = false;

            for (let i = 0; i < word.length; i++) {
                answer[i] = "";
                message = answer.join(" ");
            }

            //sends changes to client, client can play again.
            socket.emit('serverMsg', {
                msg: message.toUpperCase(),
                error: errorMsg,
                lifeMsg: life,
                wrongLtrs: wrongLetters,
                popMsg: popMessage,
            });
        }
    });
});