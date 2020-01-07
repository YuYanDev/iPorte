"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redis = _interopRequireDefault(require("redis"));

var _logger = _interopRequireDefault(require("./logger"));

var startRedis = function startRedis() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    port: 6379,
    address: "127.0.0.1"
  };

  var client = _redis.default.createClient(config.port, config.address);

  client.on("error", err => {
    _logger.default.error(err);
  });
  return client;
};

var _default = startRedis;
exports.default = _default;