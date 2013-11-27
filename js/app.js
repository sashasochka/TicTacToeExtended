var app = angular.module('TicTacToeClient', []);

app.factory('game', function () {
  return new TicTacToeGame();
});

app.factory('statistics', function () {
  return {
    score: [0, 0, 0] // Game score. 0 draws, 0:0 wins in the beginning
  };
});

function Player(id, username) {
  this.id = id;
  this.username = username || "";
  this.getUsername = function () {
    return this.username || "Player " + this.id;
  };
}

app.factory('players', function () {
  return [
    new Player(1),
    new Player(2)
  ];
});

app.factory('notifications', function () {
  return [];
});

app.service('settings', function () {
  this.botEnabled = true;
  this.botDelay = 500;
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.run(function ($rootScope, $window){
  var table = angular.element("#main-table");
  var getSize = function () {
    return Math.min($window.outerHeight * 0.88,
      $window.outerWidth * 0.5);
  };

  var updateSizes = function () {
    table.height(getSize());
    table.width(getSize());
  };
  updateSizes();
  angular.element($window).bind('resize', updateSizes);
});
