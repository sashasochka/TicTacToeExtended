"use strict";


var TicTacToeGame = function (movesHistory) {
  this.turn = 1;
  this.previousTurnCoord = {y: -1, x: -1};
  this.baseSize = 3;
  this.size = this.baseSize * this.baseSize;
  this.currentPlayer = 1;
  this.cell = array2dInit(this.size, this.size, function (coord) {
    return new TicTacToeGame.Cell(coord);
  });

  var tmpOuterThis = this;
  this.square = array2dInit(this.baseSize, this.baseSize, function (coord) {
    var result = new TicTacToeGame.Cell(coord);
    result.topLeftCellCoord = {
      y: coord.y * tmpOuterThis.baseSize,
      x: coord.x * tmpOuterThis.baseSize
    };
    return result;
  });
  this.movesHistory = [];
  this._winner = TicTacToeGame.undefinedWinner;
  if (movesHistory) {
    _.each(movesHistory, this.makeTurn, this);
  }
};

TicTacToeGame.draw = -1;
TicTacToeGame.undefinedWinner = 0;

TicTacToeGame.Cell = function (coord, player) {
  assert(coord !== undefined);
  this.coord = coord;
  this.owner = player || TicTacToeGame.undefinedWinner;
  assert(this.owner >= 0,
    "Cell should be initialized with player number greater or equal than 0. Value passed: " + player);
};

TicTacToeGame.Cell.prototype.empty = function () {
  return this.owner === 0;
};

TicTacToeGame.prototype.reset = TicTacToeGame;

TicTacToeGame.prototype.clone = function () {
  return new TicTacToeGame(this.movesHistory);
};

TicTacToeGame.prototype.undo = function () {
  if (this.isFirstMove()) {
    return;
  }
  var movesHistory = this.movesHistory;
  movesHistory.pop();
  this.reset(movesHistory);
};

TicTacToeGame.prototype.getCell = function (arg1, arg2) {
  if (arguments.length === 1) {
    var coord = arg1;
    return this.cell[coord.y][coord.x];
  } else  if (arguments.length === 2) {
    return this.cell[arg2][arg1];
  } else {
    throw 'Incorrect number of arguments to getCell function!'
  }
};

TicTacToeGame.prototype.getSquare = function (arg1, arg2) {
  if (arguments.length === 1) {
    var coord = arg1;
    return this.square[coord.y][coord.x];
  } else  if (arguments.length === 2) {
    return this.square[arg2][arg1];
  } else {
    throw 'Incorrect number of arguments to getSquare function!'
  }
};

TicTacToeGame.prototype.makeTurn = function (coord) {
  // makes a turn by the current user
  // returns false if a move is illegal
  if (!this.isAllowedMove(coord)) {
    throw 'Illegal move!';
  }

  var squareCoord = this.squareCoordByCell(coord);

  // update cell ownership
  this.getCell(coord).owner = this.currentPlayer;

  // update square ownership
  this._updateSquareOwnership(squareCoord, this.currentPlayer);

  // now it's a turn of the next player
  // 2 becomes 1 and 1 becomes 2
  this.currentPlayer = this.opponentTo(this.currentPlayer);
  this.previousTurnCoord = _.clone(coord);
  this.movesHistory.push(this.previousTurnCoord);
  this.turn++;
  this._winner = this.findWinner();
  return this;
};

TicTacToeGame.prototype.isFirstMove = function () {
  return this.turn === 1;
};

TicTacToeGame.prototype.isAllowedMove = function (coord) {
  // some assertions
  assert(0 <= coord.x && coord.x < this.size, "x coordinate in makeTurn fails out of range");
  assert(0 <= coord.y && coord.y < this.size, "y coordinate in makeTurn fails out of range");
  assert(!this.finished(), "Cannot make moves after game is finished!");
  var squareCoord = this.squareCoordByCell(coord);
  var nxtSquare = this.nextSquare();
  var correctSquareCoord = (nxtSquare ? nxtSquare.coord : squareCoord);

  // cannot put to already filled cell
  if (!this.getCell(coord).empty()) {
    return false;
  }

  return _.isEqual(correctSquareCoord, squareCoord);
};

TicTacToeGame.prototype.finished = function () {
  return this.winner() !== TicTacToeGame.undefinedWinner;
};


TicTacToeGame.prototype.winner = function () {
  return this._winner;
};

TicTacToeGame.prototype.findWinner = function () {
  if (this._checkWinner(1)) {
    return 1;
  }
  if (this._checkWinner(2)) {
    return 2;
  }

  // check draw
  // draw if impossible to win (trivial and non-100% check)
  return this.impossibleToWin() ? TicTacToeGame.draw : TicTacToeGame.undefinedWinner;
};

TicTacToeGame.prototype.impossibleToWin = function () {
  if (this.turn === this.size * this.size + 1) return true;
  var row, col;
  for (var player = 1; player <= 2; ++player) {
    // horizontal checks
    for (row = 0; row < this.baseSize; ++row) {
      var possibleWinByRow = true;
      for (col = 0; col < this.baseSize; ++col) {
        if (this.getSquare(col, row).owner === this.opponentTo(player)) {
          possibleWinByRow = false;
          break;
        }
      }
      if (possibleWinByRow) {
        return false;
      }
    }
    // vertical checks
    for (col = 0; col < this.baseSize; ++col) {
      var possibleWinByCol = true;
      for (row = 0; row < this.baseSize; ++row) {
        if (this.getSquare(col, row).owner === this.opponentTo(player)) {
          possibleWinByCol = false;
          break;
        }
      }
      if (possibleWinByCol) {
        return false;
      }
    }

    // diagonal checks
    var possibleWinByMainDiagonal = true,
      possibleWinByAdditionalDiagonal = true;
    for (var index = 0; index < this.baseSize; ++index) {
      if (this.getSquare(index, index).owner === this.opponentTo(player)) {
        possibleWinByMainDiagonal = false;
      }
      if (this.getSquare(this.baseSize - index - 1, index).owner === this.opponentTo(player)) {
        possibleWinByAdditionalDiagonal = false;
      }
    }
    if (possibleWinByMainDiagonal || possibleWinByMainDiagonal) {
      return false;
    }
  }
  return true;
};

TicTacToeGame.prototype.nextSquare = function () {
  if (this.isFirstMove()) return undefined;

  var y = this.previousTurnCoord.y % this.baseSize;
  var x = this.previousTurnCoord.x % this.baseSize;
  if (this.getSquare(x, y).owner !== TicTacToeGame.undefinedWinner ||
      this._checkSquareFull({y: y,  x: x})) {
    return undefined;
  }

  return this.getSquare(x, y);
};

TicTacToeGame.prototype.opponentTo = function (player) {
  return 3 - player;
};

TicTacToeGame.prototype.turnLeadsToSameSquare = function (coord) {
  var squareCoord = this.squareCoordByCell(coord);
  return _.isEqual(
    {y: coord.y % this.baseSize, x: coord.x % this.baseSize},
    squareCoord
  );
};

TicTacToeGame.prototype.squareCoordByCell = function (coord) {
  return {
    y: Math.floor(coord.y / this.baseSize),
    x: Math.floor(coord.x / this.baseSize)
  };
};

TicTacToeGame.prototype._updateSquareOwnership = function (squareCoord, player) {
  if (!this.getSquare(squareCoord).empty()) {
    return;
  }
  var playerOwnsSquare = false;
  for (var row = 0; row < this.baseSize; ++row) {
    if (this._checkInnerRow(squareCoord, row, player)) {
      playerOwnsSquare = true;
    }
  }
  for (var col = 0; col < this.baseSize; ++col) {
    if (this._checkInnerCol(squareCoord, col, player)) {
      playerOwnsSquare = true;
    }
  }
  if (this._checkInnerDiagonals(squareCoord, player)) {
    playerOwnsSquare = true;
  }
  if (playerOwnsSquare) {
    this.getSquare(squareCoord).owner = player;
  }
};

TicTacToeGame.prototype._checkWinner = function (player) {
  var self = this;
  return _.any(_.range(this.baseSize), function (index) {
    return self._checkOuterRow(index, player) || self._checkOuterCol(index, player);
  }) || this._checkOuterDiagonals(player);
};

TicTacToeGame.prototype._checkOuterRow = function (row, player) {
  var self = this;
  return _.all(_.range(this.baseSize), function (col) {
    return self.getSquare(col, row).owner === player;
  });
};

TicTacToeGame.prototype._checkOuterCol = function (col, player) {
  var self = this;
  return _.all(_.range(this.baseSize), function (row) {
    return self.getSquare(col, row).owner === player;
  });
};

TicTacToeGame.prototype._checkOuterDiagonals = function (player) {
  var self = this;
  var sz = this.baseSize;
  var mainDiagonal = _.all(_.range(sz), function (row) {
    return self.getSquare(row, row).owner === player;
  });

  var additionalDiagonal = _.all(_.range(sz), function (row) {
    return self.getSquare(row, sz - row - 1).owner === player;
  });
  return mainDiagonal || additionalDiagonal;
};

TicTacToeGame.prototype._checkSquareFull = function (SquareCoord) {
  var self = this;
  var sz = self.baseSize;
  var y = SquareCoord.y;
  var x = SquareCoord.x;
  return _.all(_.range(y * sz, (y + 1) * sz), function (row) {
    return _.all(_.range(x * sz, (x + 1) * sz), function (col) {
      return !self.getCell(col, row).empty();
    });
  });
};

TicTacToeGame.prototype._checkInnerRow = function (SquareCoord, innerRow, currentPlayer) {
  var colStart = this.baseSize * SquareCoord.x;
  var row = this.baseSize * SquareCoord.y + innerRow;
  for (var col = colStart; col < colStart + this.baseSize; ++col) {
    if (this.getCell(col, row).owner !== currentPlayer) {
      return false;
    }
  }
  return true;
};

TicTacToeGame.prototype._checkInnerCol = function (SquareCoord, innerCol, currentPlayer) {
  var rowStart = this.baseSize * SquareCoord.y;
  var col = this.baseSize * SquareCoord.x + innerCol;
  for (var row = rowStart; row < rowStart + this.baseSize; ++row) {
    if (this.getCell(col, row).owner !== currentPlayer) {
      return false;
    }
  }
  return true;
};

TicTacToeGame.prototype._checkInnerDiagonals = function (SquareCoord, currentPlayer) {
  var sz = this.baseSize;
  var x = SquareCoord.x;
  var y  = SquareCoord.y;
  var self = this;
  return _.all(_.range(sz), function (di) {
    return self.getCell(x * sz + di, y * sz + di).owner === currentPlayer;
  }) || _.all(_.range(sz), function (di) {
    return self.getCell(x * sz + di, y * sz + sz - di - 1).owner === currentPlayer;
  });
};
