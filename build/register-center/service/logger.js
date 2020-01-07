"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTime = function getTime() {
  return (0, _moment2.default)().format("YYYY/MM/DD HH:mm:ss");
};

exports.default = {
  info: function info(_info) {
    console.log(_chalk2.default.green(getTime() + " [info]: " + String(_info)));
  },
  error: function error(info) {
    console.log(_chalk2.default.red(getTime() + " [info]: " + String(info)));
  },
  warn: function warn(info) {
    console.log(_chalk2.default.yellow(getTime() + " [info]: " + String(info)));
  }
};