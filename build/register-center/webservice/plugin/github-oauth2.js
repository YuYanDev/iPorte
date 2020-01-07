"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientID = "640aec9ced7002941f76";
var ClientSecret = "c3d8f5b4fbcdb0f57dccd9fcdec94836b648166b";

var redirectGithub = function redirectGithub(ctx) {
  var timeStamp = new Date().valueOf();
  ctx.redirect("https://github.com/login/oauth/authorize?client_id=" + ClientID + "&scope=" + ClientSecret + "&state=" + timeStamp);
};

var githubOAuth2 = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
    var reqUrl, params, res, access_token, userData;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reqUrl = ctx.request.url;

            if (!(reqUrl.indexOf("/auth/error") !== -1)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return");

          case 5:
            if (!(reqUrl.indexOf("/auth/github_callback?code") !== -1)) {
              _context.next = 21;
              break;
            }

            params = {
              client_id: ClientID,
              client_secret: ClientSecret,
              code: ctx.query.code
            };
            _context.next = 9;
            return _axios2.default.post("https://github.com/login/oauth/access_token", params);

          case 9:
            res = _context.sent;

            if (!res.data) {
              _context.next = 18;
              break;
            }

            access_token = res.data.split("&")[0].split("=")[1];
            _context.next = 14;
            return _axios2.default.get("https://api.github.com/user?access_token=" + access_token);

          case 14:
            userData = _context.sent;

            if (userData.data) {
              ctx.session.id = userData.data.id;
              ctx.session.username = userData.data.name;
              console.log(userData.data);
              ctx.redirect("/");
            } else {
              ctx.redirect("/auth/error");
            }
            _context.next = 19;
            break;

          case 18:
            ctx.redirect("/auth/error");

          case 19:
            _context.next = 22;
            break;

          case 21:
            redirectGithub(ctx);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function githubOAuth2(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = githubOAuth2;