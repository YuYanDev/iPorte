"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var ClientID = "640aec9ced7002941f76";
var ClientSecret = "c3d8f5b4fbcdb0f57dccd9fcdec94836b648166b";

var redirectGithub = function redirectGithub(ctx) {
  var timeStamp = new Date().valueOf();
  ctx.redirect("https://github.com/login/oauth/authorize?client_id=".concat(ClientID, "&scope=").concat(ClientSecret, "&state=").concat(timeStamp));
};

var githubOAuth2 =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (ctx) {
    var reqUrl = ctx.request.url;

    if (reqUrl.indexOf("/auth/error") !== -1) {
      return;
    } else if (reqUrl.indexOf("/auth/github_callback?code") !== -1) {
      var params = {
        client_id: ClientID,
        client_secret: ClientSecret,
        code: ctx.query.code
      };
      var res = yield _axios.default.post("https://github.com/login/oauth/access_token", params);

      if (res.data) {
        var access_token = res.data.split("&")[0].split("=")[1];
        var userData = yield _axios.default.get("https://api.github.com/user?access_token=".concat(access_token));

        if (userData.data) {
          ctx.session.id = userData.data.id;
          ctx.session.username = userData.data.name;
          console.log(userData.data);
          ctx.redirect("/");
        } else {
          ctx.redirect("/auth/error");
        }
      } else {
        ctx.redirect("/auth/error");
      }
    } else {
      redirectGithub(ctx);
    }
  });

  return function githubOAuth2(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = githubOAuth2;
exports.default = _default;