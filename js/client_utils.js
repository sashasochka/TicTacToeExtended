"use strict";

var notificationElement = $('#notification');

var sendNotification = function (msg) {
  notificationElement.html(msg);
};

var newCanvasSize = function () {
  var deviceWidth = $(window).width(),
    deviceHeight = $(window).height();
  var result = Math.min(deviceWidth, deviceHeight) * 7 / 8;
  sendNotification('Size: ' + result + ', width: ' + deviceHeight + ', height: ' + deviceWidth);
  return {
    width: result,
    height: result
  };
};
