/* Controllers */
var notification_color = {
  warning: 'orange',
  error: 'red',
  congratulations: 'green'
};

function Warning(text) {
  this.style = {
    color: notification_color.warning
  };
  this.text = 'Warning: ' + text;
}

function Congratulations(text) {
  this.style = {
    color: notification_color.congratulations
  };
  this.text = 'Congratulations! ' + text;
}


function Cell(coord, square, game, notifications) {
  this.coord = coord;
  this.square = square;
  this.game = game;
  this.style = {};

  var self = this;
  this.click = function () {
    if (!game.isAllowedMove(this.coord)) {
      notifications.push(new Warning('Incorrect move!'));
    } else {
      var image_src = 'img/' + (game.currentPlayer == 1 ? 'cross' : 'circle') + '.png';
      game.makeTurn(this.coord);
      self.style.backgroundImage = 'url(' + image_src + ')';
      if (game.finished()) {
        notifications.push(new Congratulations('Player ' + game.winner() + ' has won!'));
      } else {
        notifications.push();
      }

      if (!game.isFirstMove()) {
        var squareCoord = game.squareCoordByCell(game.previousTurnCoord);
        square.main_table[squareCoord.y][squareCoord.x].style.borderColor = '';
      }
      var nextSquareCoord = game.nextSquare().coord;
      if (nextSquareCoord && !game.finished()) {
        square.main_table[nextSquareCoord.y][nextSquareCoord.x].style.borderColor = 'yellow';
      }
    }
  };
}

function Square(coord, main_table, game, notifications) {
  this.coord = coord;
  this.main_table = main_table;
  this.game = game;
  this.style = {};
  this.table = [];
  for (var row = 0; row < 3; ++row) {
    this.table[row] = [];
    for (var col = 0; col < 3; ++col) {
      this.table[row][col] = new Cell({y: row + 3 * coord.y, x: col + 3 * coord.x}, this, game, notifications);
    }
  }
}

function GameController($scope, game) {
  $scope.notifications = [];
  $scope.table = [];
  for (var row = 0; row < 3; ++row) {
    $scope.table[row] = [];
    for (var col = 0; col < 3; ++col) {
      $scope.table[row][col] = new Square({y: row, x: col}, $scope.table, game, $scope.notifications);
    }
  }
  $scope.currentPlayerImgSrc = function () {
    return 'img/' + (game.currentPlayer == 1 ? 'cross' : 'circle') + '.png';
  }
}
