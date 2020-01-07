"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _moment = _interopRequireDefault(require("moment"));

var getTime = () => {
  return (0, _moment.default)().format("YYYY/MM/DD HH:mm:ss");
};

var _default = {
  info: _info => {
    console.log(_chalk.default.green("".concat(getTime(), " [info]: ").concat(String(_info))));
  },
  error: info => {
    console.log(_chalk.default.red("".concat(getTime(), " [info]: ").concat(String(info))));
  },
  warn: info => {
    console.log(_chalk.default.yellow("".concat(getTime(), " [info]: ").concat(String(info))));
  }
};
exports.default = _default;