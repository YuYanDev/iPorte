"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _logger = _interopRequireDefault(require("../../service/logger"));

var Logger = () => {
  return (
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2.default)(function* (ctx, next) {
        ctx.Logger = _logger.default;
        yield next();

        if (ctx.status === 500) {
          ctx.Logger.error("".concat(ctx.status, " ").concat(ctx.request.method, " ").concat(ctx.request.url));
        } else if (ctx.status === 200 || ctx.status === 302) {
          ctx.Logger.info("".concat(ctx.status, " ").concat(ctx.request.method, " ").concat(ctx.request.url));
        } else {
          ctx.Logger.warn("".concat(ctx.status, " ").concat(ctx.request.method, " ").concat(ctx.request.url));
        }
      });

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

var _default = Logger;
exports.default = _default;