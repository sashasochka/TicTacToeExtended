var app = angular.module('TicTacToeClient', []);

app.factory('game', function () {
  return new TicTacToeGame();
});

function Player(id, defaultUsername) {
  this.id = id;
  this.username = "";
  this.score = 0;
  this.getUsername = function () {
    return this.username || defaultUsername || "Player " + this.id;
  };
}

app.factory('players', function () {
  return [
    new Player(1, "You"),
    new Player(2, "EasyBot")
  ];
});

app.factory('notifications', function () {
  return [];
});

app.factory('settings', function () {
  return {
    bot: {
      enabled: true,
        delay: 500,
        level: 1
    }
  }
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.filter('head', function() {
  return _.first;
});

app.run(function ($rootScope, $window){
  var table = angular.element('#main-table');
  var squares = angular.element('.square');
  var cells = angular.element('.cell');
  var getSize = function () {
    return Math.min($window.outerHeight * 0.85,
      $window.outerWidth * 0.5);
  };
  var updateSizes = function () {
    table.height(getSize());
    table.width(getSize());
    var squareSize = getSize() / 3 - 3;
    squares.height(squareSize);
    squares.width(squareSize);
    cells.height(squareSize / 3 - 15);
    cells.width(squareSize / 3 - 15);
  };
  updateSizes();
  angular.element($window).bind('resize', updateSizes);
});
