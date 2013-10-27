var app = angular.module('TicTacToeClient', []);
app.factory('game', function () {
  return new TicTacToeGame();
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})