"use strict";

var canvasSize;
var game;
var canvas;
var selectedSquare;

var opponentIsHuman = true;

var bot = new EasyBot();

var botGeneratedMove = function () {
  try {
    return bot.getMove(game);
  } catch (e) {
    if (_.isString(e)) {
      var email = 'sasha.sochka@gmail.com';
      sendNotification('Exception in bot ' + bot.name + ': ' + e + '\n' +
        'Report to project maintainer personally or via email ' +
        '&lt;<a href="mailto:' + email + '">' + email + '</a>&gt;');
    } else {
      throw e;
    }
  }
};

var startGame = function () {
  canvasSize = newCanvasSize()
  game = new TicTacToeGame();
  canvas = new GameCanvas('TicTacToeCanvas', game, canvasSize);
  canvas.setup();
  updateCanvasSize();
  canvas.display();
  canvas.cellClicked(makeMoveTo);
};

function botIntendedToMove() {
  return !game.finished() && game.currentPlayer === 2 && opponentIsHuman;
}

var makeMoveTo = function (cellCoord) {
  if (game.makeTurn(cellCoord)) {
    updateCanvasOnMoveTo(cellCoord);
    if (botIntendedToMove()) {
      _.delay(makeBotGeneratedMove, 200);
    }
  } else {
    sendNotification('Invalid move! Player: ' + game.currentPlayer);
  }
};

var makeBotGeneratedMove = _.compose(makeMoveTo, botGeneratedMove);


var updateCanvasOnMoveTo = function (cellCoord) {
  if (selectedSquare) {
    canvas.getSquare(selectedSquare).unselect();
    selectedSquare = undefined;
  }
  var cell = canvas.getCell(cellCoord);
  cell.drawSymbolOfPlayer(game.getCell(cellCoord).owner);
  var previousSquareCoord = game.squareCoordByCell(game.previousTurnCoord);
  var owner = game.getSquare(previousSquareCoord).owner;
  if (owner !== TicTacToeGame.undefinedWinner) {
    canvas.getSquare(previousSquareCoord).setOwnerBackground(owner);
  }
  if (game.finished()) {
    var winner = game.winner();
    if (winner !== TicTacToeGame.draw) {
      sendNotification('Winner: Player ' + winner);
    } else {
      sendNotification('Winner: Draw!');
    }

  } else {
    sendNotification('Move of player: ' + game.currentPlayer);
    var nextSquare = game.nextSquare();
    if (nextSquare) {
      selectedSquare = nextSquare.coord;
      canvas.getSquare(selectedSquare).select();
    }
  }
};

var updateCanvasSize = function () {
  canvas.resize(newCanvasSize());
};
