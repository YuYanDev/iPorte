"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _concatStream = _interopRequireDefault(require("concat-stream"));

var _toml = _interopRequireDefault(require("toml"));

var _index = require("../constants/index");

var _logger = _interopRequireDefault(require("./logger"));

var loadConfigObjFromToml = function loadConfigObjFromToml(filePath) {
  return new Promise(function (resolve) {
    _fs.default.readFile(filePath, function (err, data) {
      if (err) {
        _logger.default.error(err);

        _logger.default.warn("can't load config file. load default config");

        resolve(_index.defaultConfig);
        return;
      }

      resolve(_toml.default.parse(data.toString()));
    });
  });
};

var _default = loadConfigObjFromToml;
exports.default = _default;