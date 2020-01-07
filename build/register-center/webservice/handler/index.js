"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var index = new _koaRouter.default();
index.get("/",
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (ctx) {
    yield ctx.render('index.html');
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
var _default = index;
exports.default = _default;