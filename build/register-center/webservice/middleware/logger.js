"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _logger = require("../../service/logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Logger = function Logger() {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              ctx.Logger = _logger2.default;
              _context.next = 3;
              return next();

            case 3:
              if (ctx.status === 500) {
                ctx.Logger.error(ctx.status + " " + ctx.request.method + " " + ctx.request.url);
              } else if (ctx.status === 200 || ctx.status === 302) {
                ctx.Logger.info(ctx.status + " " + ctx.request.method + " " + ctx.request.url);
              } else {
                ctx.Logger.warn(ctx.status + " " + ctx.request.method + " " + ctx.request.url);
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

exports.default = Logger;