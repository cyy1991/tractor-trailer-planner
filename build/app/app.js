// Generated by CoffeeScript 1.6.2
(function() {
  var addLayer;

  ko.applyBindings(config);

  addLayer = function(name) {
    return cnvs.append(name, document.getElementById('container'), config.canvasWidth, config.canvasHeight);
  };

  window.ctxMap = addLayer('map1');

  window.ctxTrajectory = addLayer('trajectory');

  window.ctxTruck = addLayer('truck');

  window.ctxPath = addLayer('path');

  window.ctxInput = addLayer('input');

  window.ctxBuffer = cnvs.create(config.canvasWidth, config.canvasHeight);

  window.app = $(document);

  window.eventInfo = function(e) {
    var delta;

    if (config.debug >= 2) {
      delta = +(new Date) - config.startTime;
      return console.info(e.type, "@ " + delta + "ms from start");
    }
  };

  $(function() {
    var launchConf;

    if (config.profile) {
      console.profile();
    }
    launchConf = {
      x: 0,
      y: 0,
      theta: -PIHALF,
      theta1: -PIHALF,
      r: 0
    };
    app.trigger('angle.lidar', [launchConf.theta1]);
    app.trigger('launch.lidar', [launchConf, true]);
    return edgeDetection.init();
  });

}).call(this);
