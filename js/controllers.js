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

function CellController($scope, game, notifications) {
  $scope.coord = {
    x: $scope.innerCellIndex,
    y: $scope.outerCellIndex
  };
  $scope.owner = game.undefinedWinner;

  $scope.click = function () {
    if (!game.isAllowedMove($scope.coord)) {
      notifications.push(new Warning('Incorrect move!'));
    } else {
      $scope.owner = game.currentPlayer;
      game.makeTurn($scope.coord);
      if (game.finished()) {
        var msg = 'Player ' + game.winner() + ' has won!';
        notifications.push(new Congratulations(msg));
        bootbox.confirm('Congratulations! ' + msg + '<br>Play again?', function (result) {
          if (result) {
            $scope.$apply(game.reset());
          }
        });
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

function GameController($scope, game, notifications) {
  $scope.notifications = notifications;
  $scope.gameSize = 3;
  $scope.indexesRange = _.range($scope.gameSize);
  $scope.currentPlayerImgSrc = function () {
    return 'img/' + (game.currentPlayer == 1 ? 'cross' : 'circle') + '.png';
  }
  $scope.restartGame = function () {
    game.reset();
  };
}
