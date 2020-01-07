"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _concatStream = _interopRequireDefault(require("concat-stream"));

var _toml = _interopRequireDefault(require("toml"));

var loadConfigObjFromToml = filePath => {
  return new Promise(resolve => {
    _fs.default.createReadStream(filePath, "utf8").pipe((0, _concatStream.default)(data => {
      resolve(_toml.default.parse(data));
    }));
  });
};

var _default = loadConfigObjFromToml;
exports.default = _default;