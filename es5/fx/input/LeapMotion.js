"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.LeapMotion = function () {
  function processFingerParts(i) {
    return LeapMotion.FINGER_PARTS.map(function (p) {
      return "FINGER" + i + p.toUpperCase();
    });
  }

  pliny.class({
    parent: "Primrose.Input",
    name: "LeapMotionInput",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

  var LeapMotion = function (_Primrose$InputProces) {
    _inherits(LeapMotion, _Primrose$InputProces);

    function LeapMotion(commands, socket) {
      _classCallCheck(this, LeapMotion);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LeapMotion).call(this, "LeapMotion", commands, socket));

      _this.isStreaming = false;
      _this.controller = new Leap.Controller({ enableGestures: true });
      return _this;
    }

    _createClass(LeapMotion, [{
      key: "E",
      value: function E(e, f) {
        if (f) {
          this.controller.on(e, f);
        } else {
          this.controller.on(e, console.log.bind(console, "Leap Motion Event: " + e));
        }
      }
    }, {
      key: "start",
      value: function start(gameUpdateLoop) {
        if (this.isEnabled()) {
          var canceller = null,
              startAlternate = null;
          if (gameUpdateLoop) {
            var alternateLooper = function alternateLooper(t) {
              requestAnimationFrame(alternateLooper);
              gameUpdateLoop(t);
            };
            startAlternate = requestAnimationFrame.bind(window, alternateLooper);
            var timeout = setTimeout(startAlternate, LeapMotion.CONNECTION_TIMEOUT);
            canceller = function () {
              clearTimeout(timeout);
              this.isStreaming = true;
            }.bind(this);
            this.E("deviceStreaming", canceller);
            this.E("streamingStarted", canceller);
            this.E("streamingStopped", startAlternate);
          }
          this.E("connect");
          //this.E("protocol");
          this.E("deviceStopped");
          this.E("disconnect");
          this.E("frame", this.setState.bind(this, gameUpdateLoop));
          this.controller.connect();
        }
      }
    }, {
      key: "setState",
      value: function setState(gameUpdateLoop, frame) {
        var prevFrame = this.controller.history.get(1),
            i,
            j;
        if (!prevFrame || frame.hands.length !== prevFrame.hands.length) {
          for (i = 0; i < this.commands.length; ++i) {
            this.enable(this.commands[i].name, frame.hands.length > 0);
          }
        }

        for (i = 0; i < frame.hands.length; ++i) {
          var hand = frame.hands[i].palmPosition;
          var handName = "HAND" + i;
          for (j = 0; j < LeapMotion.COMPONENTS.length; ++j) {
            this.setAxis(handName + LeapMotion.COMPONENTS[j], hand[j]);
          }
        }

        for (i = 0; i < frame.fingers.length; ++i) {
          var finger = frame.fingers[i];
          var fingerName = "FINGER" + i;
          for (j = 0; j < LeapMotion.FINGER_PARTS.length; ++j) {
            var joint = finger[LeapMotion.FINGER_PARTS[j] + "Position"];
            var jointName = fingerName + LeapMotion.FINGER_PARTS[j].toUpperCase();
            for (var k = 0; k < LeapMotion.COMPONENTS.length; ++k) {
              this.setAxis(jointName + LeapMotion.COMPONENTS[k], joint[k]);
            }
          }
        }

        if (gameUpdateLoop) {
          gameUpdateLoop(frame.timestamp * 0.001);
        }

        this.update();
      }
    }]);

    return LeapMotion;
  }(Primrose.InputProcessor);

  LeapMotion.COMPONENTS = ["X", "Y", "Z"];

  LeapMotion.NUM_HANDS = 2;

  LeapMotion.NUM_FINGERS = 10;

  LeapMotion.FINGER_PARTS = ["tip", "dip", "pip", "mcp", "carp"];

  Primrose.InputProcessor.defineAxisProperties(LeapMotion, ["X0", "Y0", "Z0", "X1", "Y1", "Z1", "FINGER0TIPX", "FINGER0TIPY", "FINGER0DIPX", "FINGER0DIPY", "FINGER0PIPX", "FINGER0PIPY", "FINGER0MCPX", "FINGER0MCPY", "FINGER0CARPX", "FINGER0CARPY", "FINGER1TIPX", "FINGER1TIPY", "FINGER1DIPX", "FINGER1DIPY", "FINGER1PIPX", "FINGER1PIPY", "FINGER1MCPX", "FINGER1MCPY", "FINGER1CARPX", "FINGER1CARPY", "FINGER2TIPX", "FINGER2TIPY", "FINGER2DIPX", "FINGER2DIPY", "FINGER2PIPX", "FINGER2PIPY", "FINGER2MCPX", "FINGER2MCPY", "FINGER2CARPX", "FINGER2CARPY", "FINGER3TIPX", "FINGER3TIPY", "FINGER3DIPX", "FINGER3DIPY", "FINGER3PIPX", "FINGER3PIPY", "FINGER3MCPX", "FINGER3MCPY", "FINGER3CARPX", "FINGER3CARPY", "FINGER4TIPX", "FINGER4TIPY", "FINGER4DIPX", "FINGER4DIPY", "FINGER4PIPX", "FINGER4PIPY", "FINGER4MCPX", "FINGER4MCPY", "FINGER4CARPX", "FINGER4CARPY", "FINGER5TIPX", "FINGER5TIPY", "FINGER5DIPX", "FINGER5DIPY", "FINGER5PIPX", "FINGER5PIPY", "FINGER5MCPX", "FINGER5MCPY", "FINGER5CARPX", "FINGER5CARPY", "FINGER6TIPX", "FINGER6TIPY", "FINGER6DIPX", "FINGER6DIPY", "FINGER6PIPX", "FINGER6PIPY", "FINGER6MCPX", "FINGER6MCPY", "FINGER6CARPX", "FINGER6CARPY", "FINGER7TIPX", "FINGER7TIPY", "FINGER7DIPX", "FINGER7DIPY", "FINGER7PIPX", "FINGER7PIPY", "FINGER7MCPX", "FINGER7MCPY", "FINGER7CARPX", "FINGER7CARPY", "FINGER8TIPX", "FINGER8TIPY", "FINGER8DIPX", "FINGER8DIPY", "FINGER8PIPX", "FINGER8PIPY", "FINGER8MCPX", "FINGER8MCPY", "FINGER8CARPX", "FINGER8CARPY", "FINGER9TIPX", "FINGER9TIPY", "FINGER9DIPX", "FINGER9DIPY", "FINGER9PIPX", "FINGER9PIPY", "FINGER9MCPX", "FINGER9MCPY", "FINGER9CARPX", "FINGER9CARPY"]);

  LeapMotion.CONNECTION_TIMEOUT = 5000;

  return LeapMotion;
}();