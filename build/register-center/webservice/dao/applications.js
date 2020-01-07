"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setApplicationsList = exports.getApplicationsList = undefined;

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getApplicationsList = exports.getApplicationsList = function getApplicationsList(ctx) {
  return new _promise2.default(function (resovle, reject) {
    ctx.DB.get("IPorte_Applications", function (err, data) {
      if (err) {
        reject(ctx.Logger.error(String(err)));
      }
      resovle(JSON.parse(data));
    });
  });
};

var setApplicationsList = exports.setApplicationsList = function setApplicationsList(ctx, data) {
  return new _promise2.default(function (resovle, reject) {
    resovle(ctx.DB.set("IPorte_Applications", (0, _stringify2.default)(data)));
  });
};