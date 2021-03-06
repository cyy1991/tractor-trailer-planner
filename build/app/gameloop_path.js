// Generated by CoffeeScript 1.6.2
(function() {
  var draw;

  setInterval(function() {
    sensorSystem.update();
    delta.update();
    return truck.update();
  }, 10);

  draw = function() {
    truck.draw();
    waypoints.draw();
    return requestAnimFrame(draw);
  };

  draw();

}).call(this);
