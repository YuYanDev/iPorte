"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redis = require("redis");

var _redis2 = _interopRequireDefault(_redis);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startRedis = function startRedis() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { port: 6379, address: "127.0.0.1" };

  var client = _redis2.default.createClient(config.port, config.address);
  client.on("error", function (err) {
    _logger2.default.error(err);
  });
  return client;
};

exports.default = startRedis;