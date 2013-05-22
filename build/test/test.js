// Generated by CoffeeScript 1.6.2
(function() {
  describe("Truck", function() {
    describe("step()", function() {
      it("should steer continously", function() {
        var direction, i, ret, steer, _i, _results;

        steer = PIHALF - 0.1;
        direction = 1;
        ret = {
          x: 0,
          y: 0,
          theta: 0,
          theta1: 0
        };
        _results = [];
        for (i = _i = 0; _i < 3; i = ++_i) {
          _results.push(ret = truck.step(ret.x, ret.y, ret.theta, ret.theta1, direction, steer));
        }
        return _results;
      });
      return;
      it("should return coordinates", function() {
        var ret;

        ret = truck.step(0, 0, 0, 0, 1, 0, 1);
        expect(ret.x).equal(1);
        return expect(ret.y).equal(0);
      });
      it("should repeat as defined", function() {
        var ret;

        ret = truck.step(0, 0, 0, 0, 1, 0, 5);
        expect(ret.x).equal(5);
        return expect(ret.y).equal(0);
      });
      return it("should change direction with enough steps", function() {
        var ret;

        ret = truck.step(0, 0, 0, 0, 1, PIHALF - 0.1, 5);
        expect(ret.x).gt(4);
        return expect(ret.y).gt(1);
      });
    });
    describe("outline()", function() {
      return it("should return all tractor, trailer sides", function() {
        var o;

        o = truck.outlines(new Conf(0, 0, 0, 0));
        return expect(o).length(4 + 4 + 4);
      });
    });
    return describe("legalMoves", function() {
      it("should move in all directions without walls", function() {
        var conf, legal;

        conf = new Conf(10, 10, 0, 0);
        legal = truck.legalMoves(conf);
        return expect(legal).length(6);
      });
      return it("should collide with walls", function() {
        var borders, conf, frontOfTruck, legal;

        conf = new Conf(40, 40, 0, 0);
        frontOfTruck = conf.x + 1 + truck.L;
        borders = [[[frontOfTruck, 10], [frontOfTruck, 60]]];
        legal = truck.legalMoves(conf, borders, 1);
        return expect(legal).length(3);
      });
    });
  });

  describe("Computer Graphics", function() {
    describe("lineSegmentIntersect()", function() {
      it("should detect intersects", function() {
        var p;

        p = lineSegmentIntersect([2, 0], [2, 4], [0, 2], [4, 2]);
        return expect(p)["true"];
      });
      it('should detect intersects with outlines', function() {
        var b, collides, i, outlines;

        outlines = truck.outlines(new Conf(15, 0, 0, 0));
        b = [[20, 0], [20, 20]];
        i = 0;
        collides = false;
        while (i < 7) {
          if (i === 3) {
            i++;
          }
          if (lineSegmentIntersect(outlines[i], outlines[++i], b[0], b[1])) {
            collides = true;
          }
        }
        return expect(collides)["true"];
      });
      return it("should react on intersects of the segment", function() {
        var p;

        p = lineSegmentIntersect([2, 0], [2, 4], [0, 5], [4, 5]);
        return expect(p)["false"];
      });
    });
    describe("mkgraphfromcanvas()", function() {
      return it("should output a discretized canvas image array", function() {
        var c, d;

        c = document.createElement("canvas");
        c.width = 2;
        c.height = 1;
        d = c.discretize(2);
        expect(d[0]).equal(0);
        return expect(d[1]).equal(0);
      });
    });
    describe("multidimarray()", function() {
      return it("should output an empty multi-dimensional array of the specified size", function() {
        expect(cnvs.mkgraph(2, 2)).eql([[0, 0], [0, 0]]);
        return expect(cnvs.mkgraph(4, 1)).eql([[0], [0], [0], [0]]);
      });
    });
    describe('linearRegression()', function() {
      it('should recognize slope, intercept and r^2', function() {
        var f, l;

        f = function(x) {
          return 2 * x + 3;
        };
        l = linearRegression([2, 3, 4].map(function(e) {
          return [e, f(e)];
        }));
        expect(l.slope).equal(2);
        expect(l.intercept).equal(3);
        return expect(l.r2).equal(1);
      });
      it('should recognize x-axis', function() {
        var l, points;

        points = [2, 3, 4].map(function(e) {
          return [e, 0];
        });
        l = linearRegression(points);
        expect(l.slope).equal(0);
        expect(l.intercept).equal(0);
        return expect(l.r2).equal(1);
      });
      it('should recognize horizontals', function() {
        var l, points;

        points = [2, 3, 4].map(function(e) {
          return [e, 1];
        });
        l = linearRegression(points);
        expect(l.slope).equal(0);
        expect(l.intercept).equal(1);
        return expect(l.r2).equal(1);
      });
      return it('should recognize verticals', function() {
        var l, points, xIntercept;

        xIntercept = 1;
        points = [2, 3, 4].map(function(e) {
          return [xIntercept, e];
        });
        l = linearRegression(points);
        expect(l.slope).equal(0);
        expect(l.intercept).equal(xIntercept);
        return expect(l.r2).equal(1);
      });
    });
    describe('nearerThan()', function() {
      return it('should measure right', function() {
        expect(nearerThan([0, 0], [0, 10], 100))["true"];
        expect(nearerThan([0, 0], [0, 10], 99))["false"];
        expect(nearerThan([10, 0], [0, 0], 100))["true"];
        expect(nearerThan([10, 0], [0, 0], 99))["false"];
        return expect(nearerThan([117, 604], [260, 495], 60))["false"];
      });
    });
    describe('distanceToLine()', function() {
      it('should return perpendicular distance for a point on the line', function() {
        var d, intercept, p, slope;

        p = [1, 2];
        slope = 2;
        intercept = 0;
        d = distanceToLine(p, slope, intercept);
        return expect(d).equal(0);
      });
      it('should return perpendicular distance for a point off the line', function() {
        var d, intercept, p, slope;

        p = [1, 2];
        slope = 1;
        intercept = 0;
        d = distanceToLine(p, slope, intercept);
        return expect(d).equal(0.5);
      });
      it('should return perpendicular distance for a vertical', function() {
        var d, intercept, p, slope;

        p = [640, 543];
        slope = 0;
        intercept = 640;
        d = distanceToLine(p, slope, intercept, true);
        return expect(d).equal(0);
      });
      it('should return perpendicular distance for a vertical', function() {
        var d, intercept, p, slope;

        p = [3, 1];
        slope = 0;
        intercept = 1;
        d = distanceToLine(p, slope, intercept, true);
        return expect(d).equal(4);
      });
      return it('should return perpendicular distance for a horizontal', function() {
        var d, intercept, p, slope;

        p = [1, 2];
        slope = 0;
        intercept = 0;
        d = distanceToLine(p, slope, intercept);
        expect(d).equal(4);
        p = [1, 3];
        intercept = 1;
        d = distanceToLine(p, slope, intercept);
        return expect(d).equal(4);
      });
    });
    return describe('absDiff()', function() {
      return it('should return the absolute degree between two radians', function() {
        expect(absDiff(0, 0)).eql(0, 'valid 0');
        expect(absDiff(-PIHALF, -PIHALF)).eql(0, 'valid 1');
        expect(absDiff(-PI2, -PI2)).eql(0, 'valid 2');
        expect(absDiff(-PIHALF, 0)).eql(PIHALF, 'valid 3');
        expect(absDiff(0, -PIHALF)).eql(PIHALF, 'valid 4');
        expect(absDiff(0, -1 * Math.PI / 4)).eql(Math.PI / 4, 'valid 5');
        expect(absDiff(0, -3 * Math.PI / 4)).eql(3 * Math.PI / 4, 'invalid 0');
        return expect(absDiff(0, -5 * Math.PI / 4)).eql(3 * Math.PI / 4, 'invalid 1');
      });
    });
  });

  describe('Planner', function() {
    describe('equals', function() {
      it('should see the same nodes as equal', function() {
        var p1, p2;

        p1 = new Conf(400, 400, -PIHALF, -PIHALF);
        p2 = new Conf(400, 400, -PIHALF, -PIHALF);
        return expect(equals(p1, p2))["true"];
      });
      it('should see different translational nodes as not equal', function() {
        var p1, p2;

        p1 = new Conf(400, 400, -PIHALF, -PIHALF);
        p2 = new Conf(400, 401, -PIHALF, -PIHALF);
        return expect(equals(p1, p2))["false"];
      });
      it('should see different rotational nodes as not equal', function() {
        var p1, p2;

        p1 = new Conf(400, 400, -PIHALF, -PIHALF);
        p2 = new Conf(400, 400, -PIHALF + 0.01, -PIHALF);
        return expect(equals(p1, p2))["false"];
      });
      it('should support nearly equals', function() {
        var p1, p2;

        p1 = new Conf(400, 400, -PIHALF, -PIHALF);
        p2 = new Conf(400 + 30, 400 - 10, -PIHALF + 0.2, -PIHALF - 0.2);
        return expect(equals(p1, p2, 1600, 0.2))["true"];
      });
      return it('should see nodes as equal were information is missing', function() {
        var p1, p2;

        p1 = new Conf(400, 400, -PIHALF, -PIHALF);
        p2 = new Conf(400, 400);
        return expect(equals(p1, p2))["true"];
      });
    });
    describe('lookupTable', function() {
      it('should round correctly', function() {
        expect(lookupTable.round(10, 10)).equal(10);
        expect(lookupTable.round(12, 10)).equal(10);
        expect(lookupTable.round(19, 10)).equal(20);
        expect(lookupTable.round(245, 10)).equal(250);
        return expect(lookupTable.round(245, 100)).equal(200);
      });
      it('should hash correctly', function() {
        var hash;

        hash = lookupTable.hash(new Conf(400, 400, -PIHALF, -PIHALF));
        return expect(hash).eql({
          x: 400,
          y: 400,
          theta: -1.55,
          theta1: -1.55
        });
      });
      it('should build', function() {
        expect(lookupTable.table)["null"];
        lookupTable.build();
        return expect(Object.keys(lookupTable.table)).length(64);
      });
      it('should be correct', function() {
        var goal, goalDirect, goalGet, i, lastConf, nextMove, steps, _i;

        steps = 10;
        goal = new Conf(400, 200, -1.55, -1.55);
        goalGet = lookupTable.get(lookupTable.startConf, goal);
        goalDirect = lookupTable.table[-1.55][400][200][-1.55];
        expect(equals(goalGet, goalDirect))["true"];
        expect(goalGet.step).equal(steps);
        lastConf = lookupTable.startConf;
        for (i = _i = 0; 0 <= steps ? _i < steps : _i > steps; i = 0 <= steps ? ++_i : --_i) {
          nextMove = truck.legalMoves(lastConf, [], null, [goalGet.s], [goalGet.phi]);
          if (nextMove.length > 0) {
            lastConf = nextMove[0];
          }
        }
        return expect(equals(goalGet, lastConf, 100, 0.05))["true"];
      });
      it('should normalize rotations out of [0,-pi]', function() {
        var goal, goal1, goalGet, goalGet1;

        goal = new Conf(400, 200, -1.55, -1.55);
        goal1 = new Conf(400, 200, -1.55 - 2 * Math.PI, -1.55 - 2 * Math.PI);
        goalGet = lookupTable.get(lookupTable.startConf, goal);
        goalGet1 = lookupTable.get(lookupTable.startConf, goal1);
        return expect(goalGet).eql(goalGet1);
      });
      it('should lookup straight correctly', function() {
        var newPos, straightSteps;

        newPos = new Conf(400, 200, -PIHALF, -PIHALF);
        straightSteps = lookupTable.get(center, newPos);
        return expect([straightSteps.x, straightSteps.y, straightSteps.step, Number(straightSteps.theta.toFixed(2)), Number(straightSteps.theta1.toFixed(2))]).eql([newPos.x, newPos.y, 10, -1.57, -1.57]);
      });
      it('should lookup straight correctly when theta1 differs', function() {
        var found, goal, start;

        start = new Conf(400, 400, -PIHALF, -0.5);
        goal = new Conf(400, 200);
        found = lookupTable.get(start, goal);
        return expect([found.x, found.y, Number(found.theta.toFixed(2))]).eql([goal.x, goal.y, -PIHALF.toFixed(2)]);
      });
      it('should give back solutions when no end rotation is chosen', function() {
        var found, goal;

        goal = new Conf(400, 200);
        found = lookupTable.get(center, goal);
        return expect([found.x, found.y]).eql([goal.x, goal.y]);
      });
      it('should give back no solution if move impossible', function() {
        var found, goal;

        goal = new Conf(450, 400);
        found = lookupTable.get(center, goal);
        return expect(found).empty;
      });
      it('should normalize the goal position with y-deviation', function() {
        var goal, newGoal, start;

        goal = new Conf(400, 300, -PIHALF, -PIHALF);
        start = new Conf(400, 350, -PIHALF, -PIHALF);
        newGoal = lookupTable.normalize(start, goal);
        return expect(newGoal).eql(new Conf(400, goal.y + 50, -PIHALF, -PIHALF));
      });
      it('should normalize the goal position with x-deviation', function() {
        var goal, newGoal, start, xDev;

        xDev = 50;
        goal = new Conf(400, 300, -PIHALF, -PIHALF);
        start = new Conf(300 + xDev, 400, -PIHALF, -PIHALF);
        newGoal = lookupTable.normalize(start, goal);
        return expect(newGoal).eql(new Conf(goal.x - xDev, 300, -PIHALF, -PIHALF));
      });
      return it('should normalize the goal position with theta-deviation', function() {
        var goal, newGoal, start;

        goal = new Conf(400, 300, -PIHALF, -PIHALF);
        start = new Conf(400, 400, 0, -PIHALF);
        newGoal = lookupTable.normalize(start, goal);
        return expect(newGoal).eql(new Conf(goal.y, goal.x, -PIHALF + goal.theta1, -PIHALF + goal.theta1));
      });
    });
    describe('actionPath()', function() {
      it('should find straight action paths', function() {
        var goal, path, pathGoal, start;

        goal = new Conf(400, 300, -PIHALF, -PIHALF);
        start = new Conf(400, 400, -PIHALF, -PIHALF);
        path = planner.actionPath(start, goal);
        expect(path.length).gt(0);
        pathGoal = path.last();
        return expect([pathGoal.x, pathGoal.y]).eql([goal.x, goal.y]);
      });
      it('should find straight action paths with different start angle', function() {
        var goal, path, pathGoal, start;

        goal = new Conf(400, 200);
        start = new Conf(400, 400, -PIHALF, -0.5);
        path = planner.actionPath(start, goal);
        expect(path.length).gt(0);
        pathGoal = path.last();
        return expect([pathGoal.x, pathGoal.y]).eql([goal.x, goal.y]);
      });
      return it('should find straight action paths with different start position', function() {
        var goal, path, pathGoal, start;

        goal = new Conf(400, 200, -PIHALF, -PIHALF);
        start = new Conf(400, 350, -PIHALF, -PIHALF);
        path = planner.actionPath(start, goal);
        expect(path.length).gt(0);
        pathGoal = path.last();
        return expect([pathGoal.x, pathGoal.y]).eql([goal.x, goal.y + 10]);
      });
    });
    return describe('rrt', function() {
      return it('should use an action path when feasible', function() {
        var actionPath, goal, rrtPath, start;

        goal = new Conf(400, 300, -PIHALF, -PIHALF);
        start = new Conf(400, 400, -PIHALF, -PIHALF);
        actionPath = planner.actionPath(start, goal);
        rrtPath = planner.motion(start, goal);
        console.info(rrtPath, actionPath);
        return expect(rrtPath).eql(actionPath);
      });
    });
  });

}).call(this);
