"use strict";

var EasyBot = function () {
  this.name = 'EasyBot';
};

EasyBot.prototype.getMove = function (game) {
  var self = this;
  var usefulness = _.map(_.range(game.size), function (y) {
    return _.map(_.range(game.size), function (x) {
      var coord = {y: y, x: x};
      if (game.isAllowedMove(coord)) {
        //gameCpy.makeTurn(coord);
        return self.positionScore(gameCpy, game.currentPlayer);
      } else {
        return -1;
      }
    });
  });

  var row = _.reduce(_.range(game.size), function (r1, r2) {
    if (_.max(usefulness[r1]) > _.max(usefulness[r2])) {
      return r1;
    } else {
      return r2;
    }
  });

  var col = _.reduce(_.range(game.size), function (c1, c2) {
    if (usefulness[row][c1] > usefulness[row][c2]) {
      return c1;
    } else {
      return c2;
    }
  });

  if (usefulness[row][col] < 0) {
    throw 'No moves detected';
  }
  return {y: row, x: col};
};

EasyBot.prototype.positionScore = function (game, player) {
  var score = 0;
  _.each(_.range(game.size), function (row) {
    _.each(_.range(game.size), function (col) {
      if (game.getSquare(col, row).owner === player) {
        ++score;
      }
    });
  });
  return score;
};
