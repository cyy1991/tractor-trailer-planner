// Generated by CoffeeScript 1.6.2
(function() {
  var draw;

  setInterval(function() {
    sensorSystem.update();
    delta.update();
    truck.update();
    return joystick.update();
  }, 10);

  setInterval(function() {
    return edgeDetection.update();
  }, 1000);

  draw = function() {
    map.draw();
    truck.draw();
    waypoints.draw();
    trajectory.draw();
    joystick.draw();
    frameRate.draw();
    return requestAnimFrame(draw);
  };

  draw();

}).call(this);
