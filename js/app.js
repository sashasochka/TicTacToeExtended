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

app.run(function($rootScope, $window){
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
