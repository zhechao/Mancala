const player = ["player1", "player2"];

/* Global values*/
var turn = 0;

var board = [
  4,4,4,4,4,4,4,4,4,4,4,4
];

var bank = [0,0];

/** @function displayOnePebble
  * Display one pebble in the hole whose number will be given
  * @param {string} id - the id of the place where need to display a
  * a pubble
  */
function displayOnePebble(id){
  var pebble = document.createElement('div');
  pebble.classList.add("pebble");
  var columnElement = document.getElementById(id);
  columnElement.appendChild(pebble);
}

/** @function removePebble
  * Use to remove all pebble before display the next turn's pebbles'
  * locations
  */
function removePebble(){
  for(var i = 0; i < 12; i++){
    var element1 = document.getElementById("hole-" + i);
    while(element1.firstChild){
      element1.removeChild(element1.firstChild);
    }
  }
  for(var j = 0; j < 2; j++){
    var element2 = document.getElementById("bank-" + j);
    while(element2.firstChild){
      element2.removeChild(element2.firstChild);
    }
  }
}

/** @function displayPebble
  * Display all pebbles according to the pubble numbers saved in the board
  */
function displayPebble(){
  for(var i = 11; i > -1; i--){
    var n = board[i];
    while(n != 0){
      displayOnePebble("hole-" + i);
      n--;
    }
  }
}

/** @function displayBank
  * Display all pebbles according to the pubble numbers saved in the bank
  */
function displayBank(){
  for(var i = 0; i < 2; i++){
    var n = bank[i];
    while(n != 0){
      displayOnePebble("bank-" + i);
      n--;
    }
  }
}

/** @function init
  * initialize the Game
  */
function init(){
  board = [
    4,4,4,4,4,4,4,4,4,4,4,4
  ];
  bank = [0,0];
  turn = 0;
  removePebble();
  displayPebble();
  var element1 = document.getElementById('ui');
  while(element1.firstChild){
    element1.removeChild(element1.firstChild);
  }
  displayTurn();
}

/** @function displayTurn
  * Change the ui and display the current player
  */
function displayTurn() {
  document.getElementById("ui").innerHTML =
    "It is " + player[turn] + "'s turn.<br />" +
    "Score: " + bank[0] + " - " + bank[1];
}

/** @function displayMessage
  * Displays the message in the ui.
  * @param {string} message - the message to display
  */
function displayMessage(message) {
  document.getElementById('ui').innerHTML = message;
}

/** @function checkHoleSide
  * Make sure player1 can only click botton holes and
  * player2 can only click top holes.
  * @param {integer} holeIndex - the hole to try
  * @param {integer} player - the turn var
  * @return {bool}
  */
function checkHoleSide(holeIndex){
  if(turn === 0 && holeIndex < 6){
    return true;
  }
  else if (turn === 1 && holeIndex > 5) {
    return true;
  }
  else {
    return false;
  }
}


/** @function gameEnd
  * Check after every turn end whether the game should be ended.
  * @return {bool}
  */
function gameEnd(){
  var p1 = board[0] + board[1] + board[2] + board[3] + board[4] + board[5];
  var p2 = board[6] + board[7] + board[8] + board[9] + board[10] + board[11];
  if(p1 === 0 && turn === 0){
    return true;
  }
  else if (p2 === 0 && turn === 1) {
    return true;
  }
  else {
    return false;
  }
}

/** @function displayWinner
  * Display the winner name in the ui
  * and display the button which use to restart game.
  */
function displayWinner(){
  if(bank[0] > bank[1]){
    displayMessage("The winner of this game is " + player[0] + " !<br />");
  }
  else if (bank[0] < bank[1]) {
    displayMessage("The winner of this game is " + player[1] + " !<br />");
  }
  else {
    displayMessage("Neck and Neck!")
  }
  var restartButton = document.createElement("BUTTON");
  restartButton.onclick = function(){
    init();
  }
  var t = document.createTextNode("Restart!");
  restartButton.appendChild(t);
  document.getElementById('ui').appendChild(restartButton);
}

/** @function putPebbles
  * Put the pebbles in the following hole or bank;
  * @param {integer} holeIndex - the hole to try
  * @param {integer} pebbel - the pebble amount in the clicked holes
  * @return {integer} - return the lastHole to check special case
  */
function putPebbles(holeIndex,pebble){
  var current = holeIndex;
  var rest = pebble;
  while(rest > 0){
    if(current === 5 || current === 11){
      if(current === 5 && turn === 0){
        bank[0]++;
        rest--;
      }
      if(current === 11 && turn ===1){
        bank[1]++;
        rest--;
      }
      if(rest > 0){
        current = (current+1) % 12;
        board[current]++;
        rest--;
      }
      else{
        turn = (turn + 1) % 2;
      }
    }
    else{
      current++;
      board[current]++;
      rest--;
    }
  }
  return current;
}

/** @function specialCase
  * When the last pebble put in a empty hole, then this pebble and
  * all pebbles in the opposite hole will put in player's bank
  * @param {integer} lastHole - the last hole pebble put in
  * @param {integer} player - who triggered this case
  */
function specialCase(lastHole, player){
  var ownsidePebble = board[lastHole];
  var oppositeSidePebble =  board[11 - lastHole];
  board[lastHole] = 0;
  board[11 - lastHole] = 0;
  bank[player] = bank[player] + ownsidePebble + oppositeSidePebble;
}

/** @function makeMove
  * Attempts to make a move according to mancala rules in a specific hole;
  * if empty warns the user in the ui that the move is not possible;
  * @param {integer} holeIndex - the hole to try
  */
function makeMove(holeIndex){
  if(board[holeIndex]!= 0 && checkHoleSide(holeIndex)){
    var pebble = board[holeIndex];
    var boardBackup = board;
    var player = turn;
    board[holeIndex] = 0;
    var lastHole = putPebbles(holeIndex,pebble);
    //Once the last hole was empty
    if(board[lastHole] === 1 && checkHoleSide(lastHole) && player === turn){
      setTimeout(function(){
        specialCase(lastHole, player);
        removePebble();
        displayPebble();
        displayBank();
        displayTurn();
      }, 500);
    }
    turn = (turn + 1) % 2;
    displayTurn();
    return;
  }
  //hole is empty
  var score = "Score: " + bank[0] + " - " + bank[1];
  displayMessage("You cannot do it. Please change your strategy<br />" + score);
  setTimeout(displayTurn, 2000);
}

init();

for (var i = 0; i < 12; i++){
  const hole = i;
  document.getElementById('hole-' + hole)
    .addEventListener('click', function(event) {
      event.preventDefault();
      if(gameEnd()){
        displayWinner();
      }
      else {
        makeMove(hole);
        removePebble();
        displayPebble();
        displayBank();
      }
    });
}
