"use strict";

var gameLogicTest = new TestCase("GameLogicTest");

gameLogicTest.prototype.testTurnLeadsToSameSquare = function () {
  var game = new TicTacToeGame();
  assertTrue(game.turnLeadsToSameSquare({x: 0, y: 0}));
  assertTrue(game.turnLeadsToSameSquare({x: 8, y: 0}));
  assertTrue(game.turnLeadsToSameSquare({x: 4, y: 4}));
  assertFalse(game.turnLeadsToSameSquare({x: 4, y: 2}));
  assertFalse(game.turnLeadsToSameSquare({x: 3, y: 4}));
};

gameLogicTest.prototype.testCell = function () {
  var coord = {y: 0, x: 0};
  assertTrue(new TicTacToeGame.Cell(coord).empty());
  assertFalse(new TicTacToeGame.Cell(coord, 1).empty());
  assertFalse(new TicTacToeGame.Cell(coord, 2).empty());

  assertSame(new TicTacToeGame.Cell(coord, 1).owner, 1);
  assertSame(new TicTacToeGame.Cell(coord, 2).owner, 2);
  assertException(function () {
    new TicTacToeGame.Cell(coord, -1);
  }, assert.AssertionError.name);
};

gameLogicTest.prototype.testDependencyOnPreviousMove = function () {
  var game = new TicTacToeGame();

  assertTrue(game.makeTurn({x: 0, y: 5}));
  assertFalse(game.isFirstMove());
  assertSame(game.previousTurnCoord.x , 0);
  assertSame(game.previousTurnCoord.y , 5);

  assertFalse(game.makeTurn({x: 0, y: 3}));
  assertFalse(game.makeTurn({x: 3, y: 8}));
  assertFalse(game.makeTurn({x: 5, y: 8}));

  assertSame(game.previousTurnCoord.x, 0);
  assertSame(game.previousTurnCoord.y, 5);
  assertTrue(game.makeTurn({x: 2, y: 8}));
};

gameLogicTest.prototype.testMoveSameCell = function () {
  var game = new TicTacToeGame();
  assertTrue(game.makeTurn({x: 1, y: 0}));
  assertTrue(game.makeTurn({x: 4, y: 0}));
  assertFalse(game.makeTurn({x: 1, y: 0}));
};

gameLogicTest.prototype.testSquareTopLeftCellCoord = function () {
  var game = new TicTacToeGame();
  assertSame(game.getSquare(2, 1).topLeftCellCoord.x, 6);
  assertSame(game.getSquare(2, 1).topLeftCellCoord.y, 3);
};

gameLogicTest.prototype.testNextSquare = function () {
  var game = new TicTacToeGame();
  assertUndefined(game.nextSquare());
  game.makeTurn({y: 0, x: 1});

  assertSame(game.nextSquare().topLeftCellCoord.y, 0);
  assertSame(game.nextSquare().topLeftCellCoord.x, 3);
};

gameLogicTest.prototype.testCurrentPlayer = function () {
  var game = new TicTacToeGame();
  assertSame(game.currentPlayer, 1);
  game.makeTurn({x: 1, y: 0});
  assertSame(game.currentPlayer, 2);
  assertFalse(game.makeTurn({x: 1, y: 0}));
  assertSame(game.currentPlayer, 2);
};

gameLogicTest.prototype.testGameCutEarlierByDraw = function () {
  var game = new TicTacToeGame();
  var firstPlayerSquares = [[0, 0], [1, 1], [1, 2], [2, 0]],
    secondPlayerSquares = [[1, 0], [0, 1], [0, 2], [2, 2]];
  for (var i = 0; i < firstPlayerSquares.length; ++i) {
    assertFalse(game.impossibleToWin());
    game.getSquare(firstPlayerSquares[i][0], firstPlayerSquares[i][1]).owner = 1;
    game.getSquare(secondPlayerSquares[i][0], secondPlayerSquares[i][1]).owner = 2;
  }
  assertTrue(game.impossibleToWin());
};

gameLogicTest.prototype.testGameFinishable = function () {
  var nTests = 15;
  var nMaxConsequentFails = 1000;
  for (var test = 0; test < nTests; ++test) {
    var game = new TicTacToeGame(),
      maxMoves = game.size * game.size,
      moves = 0,
      consequentFails = 0;
    while (!game.winner() && moves < maxMoves && consequentFails < nMaxConsequentFails) {
      var tryCoord = {
          x: _.random(game.size - 1),
          y: _.random(game.size - 1)
      };
      if (game.makeTurn(tryCoord)) {
        ++moves;
        consequentFails = 0;
      } else {
        ++consequentFails;
      }
    }
    assertNotSame('Game is stuck!', game.winner(), TicTacToeGame.undefinedWinner);
    assertTrue(moves >= 17);
    console.log(moves +' moves; Winner: ' + game.winner());
  }
};

gameLogicTest.prototype.testSquareIsFilled = function () {
  var game = new TicTacToeGame();
  game.makeTurn({y: 0, x: 0});
  for (var y = 0; y < 3; ++y) {
    for (var x = 0; x < 3; ++x) {
      if (y + x === 0) continue;
      game.makeTurn({y: y, x: x});
      game.makeTurn({
        y: y * game.baseSize,
        x: x * game.baseSize
      });
    }
  }
  assertTrue(game._checkSquareFull({y: 0, x: 0}));
  assertFalse(game._checkSquareFull({y: 0, x: 1}));
  assertTrue(game.makeTurn({y: 8, x: 8}));
};
