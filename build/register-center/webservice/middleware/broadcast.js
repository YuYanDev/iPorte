"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _logger = _interopRequireDefault(require("../../service/logger"));

var Broadcast = function Broadcast() {
  return (
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2.default)(function* (ctx, next) {
        var broadcast = function broadcast(data) {
          return new Promise(function (resolve) {
            var client = (0, _socket.default)("http://localhost:8080", {});
            client.on("connect", function () {
              client.emit("updateConfig", data);

              _logger.default.info("Start update config");

              resolve();
            });
          });
        };

        ctx.broadcast = broadcast;
        yield next();
      });

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

var _default = Broadcast;
exports.default = _default;