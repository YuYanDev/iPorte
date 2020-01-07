"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _githubOauth = _interopRequireDefault(require("../plugin/github-oauth2"));

// const Auth = () => {
//   return async (ctx, next) => {
//     await next();
//   };
// };
var Auth = () => {
  return (
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2.default)(function* (ctx, next) {
        if (ctx.session && ctx.session.id) {
          yield next();
        } else if (ctx.request.url === "/" || ctx.request.url === "/favicon.ico") {
          yield next();
        } else if (ctx.request.url.indexOf("/auth") !== -1) {
          yield (0, _githubOauth.default)(ctx);
          yield next();
        } else {
          ctx.status = 401;
          ctx.body = {
            success: false,
            code: 401,
            message: "No login authentication"
          };
        }
      });

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

var _default = Auth;
exports.default = _default;