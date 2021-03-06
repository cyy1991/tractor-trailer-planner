// Generated by CoffeeScript 1.6.2
(function() {
  var absFloor, manualObstacles;

  absFloor = function(x) {
    if (x < 0) {
      return Math.ceil(x);
    } else {
      return Math.floor(x);
    }
  };

  manualObstacles = {
    obstacles: [],
    ctx: ctxMap,
    add: function(start, end) {
      return this.obstacles.push([start, end]);
    },
    draw: function() {
      var obs, _i, _len, _ref;

      this.ctx.save();
      this.ctx.translate(center.x, center.y);
      this.ctx.rotate(delta.theta);
      this.ctx.translate(-center.x - delta.x, -center.y - delta.y);
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#333';
      _ref = this.obstacles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obs = _ref[_i];
        this.ctx.lineWidth = 5;
        this.ctx.moveTo(obs[0].x, obs[0].y);
        this.ctx.lineTo(obs[1].x, obs[1].y);
      }
      this.ctx.stroke();
      return this.ctx.restore();
    }
  };

  window.map = {
    ctx: ctxMap,
    ctxBuffer: cnvs.create(800, 800),
    img: new Image(),
    jumpAt: 220,
    tileSize: 640,
    tmpVert: -1,
    tmpHori: -1,
    vert: 0,
    hori: 0,
    dirty: true,
    tmpX: 1,
    tmpY: 1,
    tmpTheta: 0,
    loadImage: function(cb) {
      var center, horiD, vertD;

      vertD = (0.000286 * this.jumpAt) / this.tileSize;
      horiD = (0.00043 * this.jumpAt) / this.tileSize;
      if (this.vert !== this.tmpVert || this.hori !== this.tmpHori) {
        this.tmpVert = this.vert;
        this.tmpHori = this.hori;
        center = [config.lat() - this.vert * vertD, config.lon() + this.hori * horiD].join();
        this.img.onload = cb;
        this.img.crossOrigin = '';
        return this.img.src = 'maps/' + center + '.png';
      } else {
        return cb();
      }
    },
    drawImage: function(deltaX, deltaY, x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this.ctxBuffer.save();
      this.ctxBuffer.fillStyle = 'rgb(223,219,212)';
      this.ctxBuffer.fillRect(x, y, config.canvasWidth, config.canvasHeight);
      this.ctxBuffer.translate(center.x, center.y);
      this.ctxBuffer.rotate(delta.theta);
      this.ctxBuffer.translate(~~(-center.x - deltaX), ~~(-center.y - deltaY));
      this.ctxBuffer.drawImage(this.img, 0, 0);
      this.ctxBuffer.fillRect(320, 625, this.tileSize - 320, this.tileSize - 625);
      this.ctxBuffer.fillRect(0, 610, 62, this.tileSize - 610);
      this.ctxBuffer.restore();
      return this.ctx.drawImage(this.ctxBuffer.canvas, 0, 0);
    },
    draw: function() {
      var _this = this;

      if (!(this.tmpX !== delta.x || this.tmpY !== delta.y || this.tmpTheta !== delta.theta)) {
        return;
      }
      this.tmpX = delta.x;
      this.tmpY = delta.y;
      this.tmpTheta = delta.theta;
      this.hori = delta.x / this.jumpAt;
      this.vert = delta.y / this.jumpAt;
      this.hori = absFloor(this.hori);
      this.vert = absFloor(this.vert);
      return this.loadImage(function() {
        _this.drawImage(delta.x - _this.jumpAt * _this.hori, delta.y - _this.jumpAt * _this.vert);
        return manualObstacles.draw();
      });
    }
  };

  app.on('obstacle.lidar', function(e, start, end) {
    manualObstacles.add(start, end);
    return manualObstacles.draw();
  });

}).call(this);
