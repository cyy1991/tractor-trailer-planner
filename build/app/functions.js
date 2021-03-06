// Generated by CoffeeScript 1.6.2
(function() {
  window.lineSegmentIntersect = function(p1, p2, p3, p4) {
    var div, ua, ub;

    div = (p4[1] - p3[1]) * (p2[0] - p1[0]) - (p4[0] - p3[0]) * (p2[1] - p1[1]);
    if (div === 0) {
      return false;
    }
    ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) - (p4[1] - p3[1]) * (p1[0] - p3[0])) / div;
    ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) - (p2[1] - p1[1]) * (p1[0] - p3[0])) / div;
    return (0 <= ua && ua <= 1) && (0 <= ub && ub <= 1);
  };

  window.absDiff = function(rad, rad1) {
    return Math.PI - Math.abs(Math.PI - Math.abs(rad - rad1));
  };

  window.euclid = function(p, q) {
    return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));
  };

  window.PIHALF = Math.PI / 2;

  window.PI2 = Math.PI * 2;

  window.Conf = function(x, y, theta, theta1, s, phi) {
    return {
      x: x,
      y: y,
      theta: theta,
      theta1: theta1,
      s: s,
      phi: phi,
      theta2: arguments.length > 6 ? arguments[6] : void 0
    };
  };

  window.center = new Conf(400, 400, -PIHALF, -PIHALF);

  window.lookupTable = {
    table: null,
    accuracy: 0.05,
    startConf: {
      x: 400,
      y: 400,
      theta: -PIHALF,
      theta1: -PIHALF,
      theta2: -PIHALF
    },
    round: function(number, power, precision) {
      if (power == null) {
        power = 10;
      }
      if (precision == null) {
        precision = 0;
      }
      return Number((power * Math.round(number / power)).toFixed(precision));
    },
    normalizeAngle: function(angle) {
      return angle % PI2;
    },
    hash: function(conf) {
      return {
        x: this.round(conf.x, 20),
        y: this.round(conf.y, 20),
        theta: this.round(conf.theta, this.accuracy, 2),
        theta1: this.round(conf.theta1, this.accuracy, 2),
        theta2: this.round(conf.theta2, this.accuracy, 2)
      };
    },
    normalize: function(start, goal) {
      var c, delta, px, py, s, x, y;

      if (typeof goal === 'undefined') {
        throw new Error('goal not defined');
      }
      if (typeof goal.theta === 'undefined') {
        return goal;
      }
      delta = {
        x: this.startConf.x - start.x,
        y: this.startConf.y - start.y,
        theta: (this.startConf.theta - start.theta) * (-1)
      };
      x = goal.x - this.startConf.x;
      y = goal.y - this.startConf.y;
      s = Math.sin(delta.theta);
      c = Math.cos(delta.theta);
      px = x * c + y * s - delta.x + this.startConf.x;
      py = x * -s + y * c + delta.y + this.startConf.y;
      c = new Conf(px, py, goal.theta - delta.theta, goal.theta1 - delta.theta, 0, 0, goal.theta2 - delta.theta1);
      return c;
    },
    get: function(start, goal) {
      var angles, bucket, keys, normGoal, startingAngle, value, _ref, _ref1, _ref2, _ref3;

      if (this.table === null) {
        this.build();
      }
      start.theta = this.normalizeAngle(start.theta);
      start.theta1 = this.normalizeAngle(start.theta1);
      goal.theta = this.normalizeAngle(goal.theta);
      goal.theta1 = this.normalizeAngle(goal.theta1);
      startingAngle = this.round(start.theta1, this.accuracy, 2);
      normGoal = this.normalize(start, goal);
      bucket = this.hash(normGoal);
      if (isNaN(bucket.theta1)) {
        value = (_ref = this.table[startingAngle]) != null ? (_ref1 = _ref[bucket.x]) != null ? _ref1[bucket.y] : void 0 : void 0;
        if (typeof value !== 'undefined') {
          keys = Object.keys(value);
          return value[keys[0]];
        }
      } else {
        angles = (_ref2 = this.table[startingAngle]) != null ? (_ref3 = _ref2[bucket.x]) != null ? _ref3[bucket.y] : void 0 : void 0;
        if (angles) {
          return angles[nearestNumber(bucket.theta1, Object.keys(angles))];
        }
      }
    },
    draw: function(theta) {
      var conf, rest, rest1, startingAngle, theta1, x, y, _ref;

      if (this.table === null) {
        this.build();
      }
      ctxTruck.save();
      ctxTruck.clearRect(0, 0, 800, 800);
      ctxTruck.beginPath();
      startingAngle = this.round(this.normalizeAngle(theta), this.accuracy, 2);
      _ref = this.table[startingAngle];
      for (x in _ref) {
        rest = _ref[x];
        for (y in rest) {
          rest1 = rest[y];
          for (theta1 in rest1) {
            conf = rest1[theta1];
            renderCar(ctxTruck, conf);
          }
        }
      }
      ctxTruck.stroke();
      ctxTruck.beginPath();
      ctxTruck.strokeStyle = '#0f0';
      renderCar(ctxTruck, new Conf(400, 400, -PIHALF, startingAngle));
      ctxTruck.stroke();
      return ctxTruck.restore();
    },
    build: function() {
      var bucket, direction, i, maxSteps, newConf, nextMove, phi, s, theta1, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _ref3, _ref4;

      this.table = {};
      maxSteps = 20;
      direction = [1, -1];
      for (theta1 = _i = -3.15, _ref = this.accuracy; _ref > 0 ? _i < 0 : _i > 0; theta1 = _i += _ref) {
        theta1 = Number(theta1.toFixed(2));
        for (_j = 0, _len = direction.length; _j < _len; _j++) {
          s = direction[_j];
          for (phi = _k = -0.55, _ref1 = this.accuracy; _ref1 > 0 ? _k < 0.55 : _k > 0.55; phi = _k += _ref1) {
            phi = Number(phi.toFixed(2));
            newConf = {
              x: this.startConf.x,
              y: this.startConf.y,
              theta: this.startConf.theta,
              theta1: theta1,
              theta2: theta1
            };
            for (i = _l = 0; 0 <= maxSteps ? _l <= maxSteps : _l >= maxSteps; i = 0 <= maxSteps ? ++_l : --_l) {
              nextMove = truck.legalMoves(newConf, [], null, [s], [phi]);
              if (nextMove.length > 0) {
                newConf = nextMove[0];
                newConf.step = i + 1;
              } else {
                break;
              }
              bucket = this.hash(newConf);
                            if ((_ref2 = this.table[theta1]) != null) {
                _ref2;
              } else {
                this.table[theta1] = {};
              };
                            if ((_ref3 = this.table[theta1][bucket.x]) != null) {
                _ref3;
              } else {
                this.table[theta1][bucket.x] = {};
              };
                            if ((_ref4 = this.table[theta1][bucket.x][bucket.y]) != null) {
                _ref4;
              } else {
                this.table[theta1][bucket.x][bucket.y] = {};
              };
              this.table[theta1][bucket.x][bucket.y][bucket.theta1] = newConf;
            }
          }
        }
      }
    }
  };

  window.nearestNumber = function(myNumber, numbers) {
    var diff, localDiff, n, nearest, _i, _len;

    diff = Infinity;
    nearest = null;
    for (_i = 0, _len = numbers.length; _i < _len; _i++) {
      n = numbers[_i];
      localDiff = Math.abs(myNumber - Number(n));
      if (localDiff < diff) {
        diff = localDiff;
        nearest = n;
      }
    }
    return nearest;
  };

}).call(this);
