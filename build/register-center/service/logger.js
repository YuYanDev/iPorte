"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _moment = _interopRequireDefault(require("moment"));

var getTime = function getTime() {
  return (0, _moment.default)().format("YYYY/MM/DD HH:mm:ss");
};

var _default = {
  info: function info(_info) {
    console.log(_chalk.default.green("".concat(getTime(), " [info]: ").concat(String(_info))));
  },
  majorinfo: function majorinfo(info) {
    console.log(_chalk.default.cyan("".concat(getTime(), " [info]: ").concat(String(info))));
  },
  error: function error(info) {
    console.log(_chalk.default.red("".concat(getTime(), " [error]: ").concat(String(info))));
  },
  warn: function warn(info) {
    console.log(_chalk.default.yellow("".concat(getTime(), " [warning]: ").concat(String(info))));
  }
};
exports.default = _default;