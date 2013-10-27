"use strict";

var RandomBot = function () {
  this.name = 'RandomBot';
};

RandomBot.prototype.getMove = function (game) {
  var nMaxConsequentFails = 1000,
    nMaxCleverTryFails = 900;
  for (var consequentFails = 0; consequentFails < nMaxConsequentFails; ++consequentFails) {
    var tryCoord = {
      x: _.random(game.size - 1),
      y: _.random(game.size - 1)
    };
    var squareCoord = game.squareCoordByCell(tryCoord);
    var isStupidMove = !game.getSquare(squareCoord).empty();
    if (game.isAllowedMove(tryCoord) && (!isStupidMove || consequentFails > nMaxCleverTryFails)) {
      return tryCoord;
    }
  }
  throw 'No moves detected';
};
