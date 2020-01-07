"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var redisDB = db => {
  return (
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2.default)(function* (ctx, next) {
        ctx.DB = db;
        yield next();
      });

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

var _default = redisDB;
exports.default = _default;