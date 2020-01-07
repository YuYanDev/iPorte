"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _githubOauth = require("../plugin/github-oauth2");

var _githubOauth2 = _interopRequireDefault(_githubOauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const Auth = () => {
//   return async (ctx, next) => {
//     await next();
//   };
// };
var Auth = function Auth() {
  return function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(ctx.session && ctx.session.id)) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return next();

            case 3:
              _context.next = 19;
              break;

            case 5:
              if (!(ctx.request.url === "/" || ctx.request.url === "/favicon.ico")) {
                _context.next = 10;
                break;
              }

              _context.next = 8;
              return next();

            case 8:
              _context.next = 19;
              break;

            case 10:
              if (!(ctx.request.url.indexOf("/auth") !== -1)) {
                _context.next = 17;
                break;
              }

              _context.next = 13;
              return (0, _githubOauth2.default)(ctx);

            case 13:
              _context.next = 15;
              return next();

            case 15:
              _context.next = 19;
              break;

            case 17:
              ctx.status = 401;
              ctx.body = {
                success: false,
                code: 401,
                message: "No login authentication"
              };

            case 19:
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

exports.default = Auth;