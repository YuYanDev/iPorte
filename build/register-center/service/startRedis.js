"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redis = _interopRequireDefault(require("redis"));

var _logger = _interopRequireDefault(require("./logger"));

var baseDataFormat = "{\"application_incremental\": 0,\"application_total\": 0,\"applications\": []}";

var startRedis = function startRedis() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    port: 6379,
    address: "127.0.0.1"
  };

  var client = _redis.default.createClient(config.port, config.address);

  client.on("error", function (err) {
    _logger.default.error(err);
  });
  client.get("IPorte_Applications", function (err, reply) {
    if (reply === null || typeof reply !== "string") {
      _logger.default.info('The database does not exist, create a database');

      client.set("IPorte_Applications", baseDataFormat);
    } else {
      try {
        var data = JSON.parse(reply);

        if (data.application_incremental === undefined || typeof data.application_incremental !== "number" || data.application_total === undefined || typeof data.application_total !== "number" || data.applications === undefined || Object.prototype.toString.call(data.applications) !== "[object Array]") {
          _logger.default.error('Database format error, rebuild the database. The original data will be overwritten');

          client.set("IPorte_Applications", baseDataFormat);
        }
      } catch (e) {
        if (String(e).match(/Unexpected end of JSON input/g)) {
          _logger.default.error('Database format error, rebuild the database. The original data will be overwritten');

          client.set("IPorte_Applications", baseDataFormat);
        }
      }
    }
  });
  return client;
};

var _default = startRedis;
exports.default = _default;