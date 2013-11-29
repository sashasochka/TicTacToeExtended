function Warning(text) {
  this.class = 'alert-warning';
  this.type = 'Warning';
  this.text = text;
}

function Congratulations(text) {
  this.class = 'alert-success';
  this.type = 'Congratulations';
  this.text = text;
}

function CellController($scope, $timeout, game, settings, players, notifications) {
  $scope.coord = {
    x: $scope.innerCellIndex,
    y: $scope.outerCellIndex
  };
  $scope.ownerID = game.undefinedWinner;
  $scope.players = players;

  var postMoveProcess = function () {
    if (game.finished()) {
      var winner = game.winner();
      var msg;
      if (winner === TicTacToeGame.draw) {
        msg = 'Draw!'
      } else {
        msg = 'Player "' + players[winner - 1].getUsername() + '" has won!';
        ++players[winner - 1].score;
      }

      notifications.push(new Congratulations(msg));
      bootbox.confirm(msg + '<br>Play again?', function (result) {
        if (result) {
          $scope.$apply(game.reset());
        }
      });
    }
  };

  $scope.click = function () {
    if (!game.isAllowedMove($scope.coord)) {
      notifications.push(new Warning('Incorrect move!'));
    } else {
      $scope.owner = players[game.currentPlayer - 1];
      $scope.ownerID = $scope.owner.id;
      game.makeTurn($scope.coord);
      postMoveProcess();
      if (settings.bot.enabled) {
        $timeout(function () {
          game.makeTurn(EasyBot.getMove(game, settings.bot.level));
          postMoveProcess();
        }, settings.bot.delay);
      }
    }
  };

  $scope.cellIsOwnedByCrosses = function () {
    return game.getCell($scope.coord).owner === 1;
  };

  $scope.cellIsOwnedByCircles = function () {
    return game.getCell($scope.coord).owner === 2;
  };
}

function SquareController($scope, game) {
  $scope.coord = {
    x: $scope.innerSquareIndex,
    y: $scope.outerSquareIndex
  };

  $scope.isNextSquare = function () {
    return game.nextSquare() && _.isEqual($scope.coord, game.nextSquare().coord);
  };

  $scope.squareIsOwnedByCrosses = function () {
    return game.getSquare($scope.coord).owner === 1;
  };

  $scope.squareIsOwnedByCircles = function () {
    return game.getSquare($scope.coord).owner === 2;
  };
}

function GameController($scope, game, settings, players, notifications) {
  $scope.notifications = notifications;
  $scope.gameSize = 3;
  $scope.indexesRange = _.range($scope.gameSize);
  $scope.players = players;
  $scope.settings = settings;
  $scope.currentPlayer = function () {
    return $scope.players[game.currentPlayer - 1];
  };
  $scope.currentPlayerFigure = function () {
    return game.currentPlayer == 1 ? 'cross' : 'circle';
  };
  $scope.restartGame = function () {
    game.reset();
  };
  $scope.undoMove = function () {
    game.undo();
    if (settings.bot.enabled) {
      game.undo();
    }
  };
  $scope.resignAs = function (player) {
    ++players[2 - player.id].score;
    $scope.restartGame();
  };
}
