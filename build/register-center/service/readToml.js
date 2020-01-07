"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _concatStream = require("concat-stream");

var _concatStream2 = _interopRequireDefault(_concatStream);

var _toml = require("toml");

var _toml2 = _interopRequireDefault(_toml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadConfigObjFromToml = function loadConfigObjFromToml(filePath) {
  return new _promise2.default(function (resolve) {
    _fs2.default.createReadStream(filePath, "utf8").pipe((0, _concatStream2.default)(function (data) {
      resolve(_toml2.default.parse(data));
    }));
  });
};

exports.default = loadConfigObjFromToml;