import './css/site.css';
import { socket } from "./socket";

function App() {
  return (
    <div className="card shadow border-0">
      <PopUp />
      <Game />
    </div>
  );
}
function PopUp() {
  return (
    <div id="popContainer" className="pop-container">
      <div className="pop">
        <div className="row">
          <span className="mb-3" id="popMessage"></span>
        </div>
        <div className="row">
          <button type="button" className="btn btn-sm btn-primary" onClick={() => playAgain()}>Play again!</button>
        </div>
      </div>
    </div>
  );
}

function Game() {
  return (
    <div>
      <div hidden id="notifications" className="notifications">
        <span id="errorMsg"></span>
      </div>

      <div className="card-body">
        <div className="row">
          <h3 className="d-flex justify-content-center">Hangman Game</h3>
          <p className="d-flex justify-content-center">Guess the word!</p>
          <div className="col-md-6">
            <div className="row">
              <span className="d-flex justify-content-center">Tries left</span>
            </div>
            <div className="row">
              <h3 className="d-flex justify-content-center" id="life"></h3>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <span className="d-flex justify-content-center">Wrong guesses</span>
            </div>
            <div className="row">
              <h3 className="d-flex justify-content-center" id="wrongLetters"></h3>
            </div>
          </div>
        </div>
        <hr />
        <div className="row flex">
          <div className="col-sm-auto d-flex justify-content-center align-items-center m-0">
            <svg height="250" width="200" className="figure-container">
              <line x1="20" y1="230" x2="100" y2="230" className="figure-part"></line>
              <line x1="60" y1="20" x2="60" y2="230" className="figure-part"></line>
              <line x1="60" y1="20" x2="140" y2="20" className="figure-part"></line>
              <line x1="140" y1="20" x2="140" y2="50" className="figure-part"></line>

              <circle cx="140" cy="70" r="20" className="figure-part"></circle>

              <line x1="140" y1="90" x2="140" y2="150" className="figure-part"></line>

              <line x1="140" y1="100" x2="120" y2="150" className="figure-part"></line>
              <line x1="140" y1="100" x2="160" y2="150" className="figure-part"></line>

              <line x1="140" y1="150" x2="120" y2="180" className="figure-part"></line>
              <line x1="140" y1="150" x2="160" y2="180" className="figure-part"></line>
            </svg>
          </div>
          <div className="col-sm-6 d-flex justify-content-center align-items-center">
            <div className="row" id="word"></div>
          </div>
        </div>
        <hr />
      </div>
      <div className="inputContainer">
        <input className="inputStyle" id="letter" type="text" placeholder="Enter a letter"
          maxLength="1" pattern="/^[A-Za-z]+$/" />
        <button id="guessBtn" className="btn btn-sm btn-primary" onClick={() => getLetter()}>Guess</button>
      </div>
    </div>
  );
}

// When you placed letter in input field, you can confirm it by pressing Enter button on keyboard
// or you just can press "Guess" button an screen with mouse.
window.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    getLetter();
  }
});

function getLetter() {
  var letter = document.getElementById('letter').value;
  socket.emit('getLetter', {
    ltr: letter
  });
  document.getElementById('letter').value = '';
}

socket.on('serverMsg', function (data) {
  var notificationMsg = document.getElementById('errorMsg').innerText = data.error;
  var word = document.getElementById('word');
  var popGameInfoMsg = document.getElementById('popMessage').innerText = data.popMsg;
  applySingleLetterStyle(word, data);
  document.getElementById('life').innerText = data.lifeMsg;
  document.getElementById('wrongLetters').innerText = data.wrongLtrs;
  if (popGameInfoMsg !== '') {
    displayGameInfo();
  }
  if (notificationMsg !== '') {
    displayNotifications();
  }
  displayBodyParts(data);
});

function playAgain() {
  socket.emit('playAgain', {
    playAgain: true
  });
  document.getElementById('letter').disabled = false;
  document.getElementById('guessBtn').disabled = false;
  document.getElementById('popContainer').style.display = "none";
}

function displayGameInfo() {
  document.getElementById('letter').disabled = true;
  document.getElementById('guessBtn').disabled = true;
  document.getElementById('popContainer').style.display = "flex";
}

function applySingleLetterStyle(word, data) {
  word.innerHTML = `${(data.msg).split(" ").map((letter) =>
    `<span class="letter">${letter}</span>`
  ).join(" ")}`;
}

function displayBodyParts(data) {
  document.querySelectorAll(".figure-part").forEach((part, index) => {
    const wrongGuesses = (data.wrongLtrs).length;
    if (index < wrongGuesses) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });
}

function displayNotifications() {
  document.getElementById('notifications').hidden = false;
  setTimeout(() => {
    document.getElementById('notifications').hidden = true;
  }, 3000);
}

export default App;
