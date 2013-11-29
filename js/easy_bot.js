"use strict";

var EasyBot = {};
EasyBot.name = 'EasyBot';

EasyBot.getMove = function (game, level) {
  // level = 1 or 2
  return _.chain(EasyBot.possibleMoves(game)).map(function (coord) {
    return _.extend(coord, {
      score : EasyBot.minimaxScore(
        game.clone().makeTurn(coord), game.currentPlayer, level)
    });
  }).sortBy('score')
    .last()
    .value();
};

EasyBot.illegalMove = -100000000000;
EasyBot.horribleMove = -10000000000;
EasyBot.superMove = 10000000000;

EasyBot.positionScore = function (game, player) {
  if (game.finished()) {
    return game.winner() === player ? EasyBot.superMove : EasyBot.horribleMove;
  }
  var score = 0;
  _.each(_.range(game.baseSize), function (row) {
    _.each(_.range(game.baseSize), function (col) {
      var scoreAdd = 0;
      var dy = Math.min(row,  2 - row);
      var dx = Math.min(col,  2 - col);
      if (dy + dx === 0) {
        scoreAdd += 15;
      } else if (dy + dx === 1) {
        scoreAdd += 10;
      } else {
        scoreAdd += 25;
      }
      if (game.getSquare(col, row).owner === player) {
        score += scoreAdd;
      } else if (game.getSquare(col, row).owner === game.opponentTo(player)) {
        score -= scoreAdd;
      }
    });
  });


  _.each(_.range(game.size), function (row) {
    _.each(_.range(game.size), function (col) {
      var scoreAdd = 0;
      var dy = Math.min(row % 3,  2 - (row % 3));
      var dx = Math.min(col % 3,  2 - (col % 3));
      if (dy + dx === 0) {
        scoreAdd += 2.05;
      } else if (dy + dx === 1) {
        scoreAdd += 2.1;
      } else {
        scoreAdd += 2;
      }
      var coord = {y: row, x: col};
      if (game.getSquare(game.squareCoordByCell(coord)).owner === TicTacToeGame.undefinedWinner) {
        if (game.getCell(coord).owner === player) {
          score += scoreAdd;
        } else if (game.getCell(coord).owner === game.opponentTo(player)) {
          score -= scoreAdd;
        }
      }
    });
  });

  return score + Math.random();
};

EasyBot.minimaxScore = function (game, player, depth) {
  // `player` just made a move
  if (depth <= 0 || game.finished()) {
    return EasyBot.positionScore(game, player);
  }
  return _.chain(EasyBot.possibleMoves(game)).map(function (move) {
    return -EasyBot.minimaxScore(game.clone().makeTurn(move),
      game.opponentTo(player), depth - 1);
  }).min()
    .value();
};

EasyBot.possibleMoves = function (game) {
  var result = [];
  _.each(_.range(game.size), function (y) {
    _.each(_.range(game.size), function (x) {
      var coord = {y: y, x: x};
      if (game.isAllowedMove(coord) &&
            game.getSquare(game.squareCoordByCell(coord)).owner === TicTacToeGame.undefinedWinner) {
        result.push(coord);
      }
    });
  });
  return result;
};
