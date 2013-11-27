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

function CellController($scope, $timeout, game, settings, players, notifications, statistics) {
  $scope.coord = {
    x: $scope.innerCellIndex,
    y: $scope.outerCellIndex
  };
  $scope.ownerID = game.undefinedWinner;
  $scope.players = players;

  $scope.click = function () {
    if (!game.isAllowedMove($scope.coord)) {
      notifications.push(new Warning('Incorrect move!'));
    } else {
      $scope.owner = players[game.currentPlayer - 1];
      $scope.ownerID = $scope.owner.id;
      game.makeTurn($scope.coord);
      if (game.finished()) {
        var winner = game.winner();
        var msg = $scope.owner.getUsername() + ' has won!';
        ++statistics.score[winner];

        notifications.push(new Congratulations(msg));
        bootbox.confirm('Congratulations! ' + msg + '<br>Play again?', function (result) {
          if (result) {
            $scope.$apply(game.reset());
          }
        });
      } else if (settings.botEnabled) {
        $timeout(function () {
          game.makeTurn(new RandomBot().getMove(game));
        }, settings.botDelay);
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

function GameController($scope, game, settings, players, notifications, statistics) {
  $scope.notifications = notifications;
  $scope.gameSize = 3;
  $scope.indexesRange = _.range($scope.gameSize);
  $scope.score = statistics.score;
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
}
