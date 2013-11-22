var app = angular.module('TicTacToeClient', []);

app.factory('game', function () {
  return new TicTacToeGame();
});

app.factory('notifications', function () {
  return [];
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});
