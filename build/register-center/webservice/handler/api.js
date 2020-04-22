"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _koaJson = _interopRequireDefault(require("koa-json"));

var _applications = require("../dao/applications");

var _applications2 = require("../service/applications");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var api = new _koaRouter.default();
api.use((0, _koaJson.default)());
api.get("/",
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2.default)(function* (ctx) {
    ctx.body = "API Index";
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
api.get("/sys/user-info",
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2.default)(function* (ctx) {
    ctx.body = {
      code: 200,
      success: true,
      username: ctx.session.username
    };
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
api.get("/application/list",
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(function* (ctx) {
    try {
      var data = yield (0, _applications.getApplicationsList)(ctx);
      ctx.body = {
        code: 200,
        success: true,
        data
      };
    } catch (e) {
      ctx.body = {
        code: 500,
        success: false,
        message: "Database Error"
      };
    }
  });

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
api.post("/application/add",
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2.default)(function* (ctx) {
    var reqObj = ctx.request.body;

    if (!reqObj.name || !reqObj.domain) {
      ctx.body = {
        code: 400,
        success: false,
        message: "Field is missing"
      };
      return;
    }

    try {
      var data = yield (0, _applications.getApplicationsList)(ctx);

      if (data) {
        var newData = _lodash.default.cloneDeep(data); // Check Domain Duplicates


        if ((0, _applications2.checkDomainDuplicates)(data.applications, reqObj.domain)) {
          ctx.body = {
            code: 400,
            success: false,
            message: "Duplicate domain name"
          };
          return;
        }

        var pushData = _objectSpread({
          id: data.applications.length + 1
        }, reqObj, {
          status: 1,
          rule_incremental_statistics: 0,
          rule_total: 0,
          rule: []
        });

        newData.application_total = data.applications.length + 1;
        newData.application_incremental = data.application_incremental + 1;
        newData.applications.unshift(pushData);
        yield (0, _applications.setApplicationsList)(ctx, newData);
        yield ctx.broadcast(newData);
        ctx.body = {
          code: 200,
          success: true,
          message: "add success"
        };
      } else {
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (E) {
      ctx.body = {
        code: 500,
        success: false,
        message: String(E)
      };
    }
  });

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());
api.post("/application/edit",
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2.default)(function* (ctx) {
    var reqObj = ctx.request.body;

    if (!reqObj.id) {
      ctx.body = {
        code: 400,
        success: false,
        message: "Field is missing"
      };
      return;
    }

    try {
      var data = yield (0, _applications.getApplicationsList)(ctx);

      if (data) {
        var newData = _lodash.default.cloneDeep(data);

        var newApplicationData = (0, _applications2.changeApplicationInfoById)(newData, reqObj);
        newData.applications = newApplicationData;
        yield (0, _applications.setApplicationsList)(ctx, newData);
        yield ctx.broadcast(newData);
        ctx.body = {
          code: 200,
          success: true,
          message: "edit success"
        };
      } else {
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (E) {
      ctx.body = {
        code: 500,
        success: false,
        message: String(E)
      };
    }
  });

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}());
api.post("/application/changestatus",
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2.default)(function* (ctx) {
    var reqObj = ctx.request.body;

    if (!reqObj.id || !(reqObj.status === 1 || reqObj.status === 0)) {
      ctx.body = {
        code: 400,
        success: false,
        message: "Field is missing"
      };
      return;
    }

    try {
      var data = yield (0, _applications.getApplicationsList)(ctx);

      if (data) {
        var newData = _lodash.default.cloneDeep(data);

        var newApplicationData = (0, _applications2.changeApplicationStatusById)(newData, reqObj.id, reqObj.status);
        newData.applications = newApplicationData;
        yield (0, _applications.setApplicationsList)(ctx, newData);
        yield ctx.broadcast(newData);
        ctx.body = {
          code: 200,
          success: true,
          message: "changestatus success"
        };
      } else {
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (E) {
      ctx.body = {
        code: 500,
        success: false,
        message: String(E)
      };
    }
  });

  return function (_x6) {
    return _ref6.apply(this, arguments);
  };
}());
api.post("/application/delete",
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2.default)(function* (ctx) {
    var reqObj = ctx.request.body;

    if (!reqObj.id) {
      ctx.body = {
        code: 400,
        success: false,
        message: "Field is missing"
      };
      return;
    }

    try {
      var data = yield (0, _applications.getApplicationsList)(ctx);

      if (data) {
        var newData = _lodash.default.cloneDeep(data);

        var newApplicationData = (0, _applications2.deleteApplicationById)(newData, reqObj.id);
        newData.applications = newApplicationData;
        newData.application_total = data.application_total - 1;
        yield (0, _applications.setApplicationsList)(ctx, newData);
        yield ctx.broadcast(newData);
        ctx.body = {
          code: 200,
          success: true,
          message: "delete success"
        };
      } else {
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (E) {
      ctx.body = {
        code: 500,
        success: false,
        message: String(E)
      };
    }
  });

  return function (_x7) {
    return _ref7.apply(this, arguments);
  };
}());
api.post("/application/:id/addrule",
/*#__PURE__*/
function () {
  var _ref8 = (0, _asyncToGenerator2.default)(function* (ctx) {
    var pid = ctx.params.id;
    var reqObj = ctx.request.body;

    if (!reqObj.name || !reqObj.suffix || !reqObj.target) {
      ctx.body = {
        code: 400,
        success: false,
        message: "Field is missing"
      };
      return;
    }

    try {
      var data = yield (0, _applications.getApplicationsList)(ctx);

      if (data) {
        var newData = _lodash.default.cloneDeep(data);

        var safeData = _lodash.default.cloneDeep(data);

        var domainObj = data.applications.find(function (x) {
          return x.id === Number(pid);
        });

        if (domainObj === undefined) {
          throw "domian not found";
        }

        newData.applications = safeData.applications.map(function (e) {
          if (e.id === Number(pid)) {
            var isRepeat = e.rule.find(function (x) {
              return x.suffix === reqObj.suffix;
            });

            if (isRepeat !== undefined) {
              throw "rule is repeat";
            }

            var newRuleElement = {
              id: e.rule.length + 1,
              name: reqObj.name,
              suffix: reqObj.suffix,
              status: 1,
              rewrite: true,
              rewrite_rule: "^",
              type: "Reverse Proxy",
              target: reqObj.target
            };

            var newDomainElement = _objectSpread({}, e, {
              rule_incremental_statistics: e.rule_incremental_statistics + 1,
              rule_total: e.rule_total + 1
            });

            newDomainElement.rule.unshift(newRuleElement);
            return newDomainElement;
          } else {
            return e;
          }
        });
        yield (0, _applications.setApplicationsList)(ctx, newData);
        yield ctx.broadcast(newData);
        ctx.body = {
          code: 200,
          success: true,
          message: "add rule success"
        };
      } else {
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        success: false,
        message: String(e)
      };
    }
  });

  return function (_x8) {
    return _ref8.apply(this, arguments);
  };
}());
api.post("/application/:id/deleterule",
/*#__PURE__*/
function () {
  var _ref9 = (0, _asyncToGenerator2.default)(function* (ctx) {
    var pid = ctx.params.id;
    var reqObj = ctx.request.body;

    if (!reqObj.id) {
      ctx.body = {
        code: 400,
        success: false,
        message: "Field is missing"
      };
      return;
    }

    try {
      var data = yield (0, _applications.getApplicationsList)(ctx);

      if (data) {
        var newData = _lodash.default.cloneDeep(data);

        var safeData = _lodash.default.cloneDeep(data);

        var domainObj = data.applications.find(function (x) {
          return x.id === Number(pid);
        });

        if (domainObj === undefined) {
          throw "domian not found";
        }

        newData.applications = safeData.applications.map(function (e) {
          if (e.id === Number(pid)) {
            var newRule = [];
            e.rule.forEach(function (element) {
              if (element.id !== reqObj.id) {
                newRule.push(element);
              }
            });

            var newApplication = _objectSpread({}, e, {
              rule: newRule,
              rule_total: newRule.length
            });

            return newApplication;
          } else {
            return e;
          }
        });
        yield (0, _applications.setApplicationsList)(ctx, newData);
        yield ctx.broadcast(newData);
        ctx.body = {
          code: 200,
          success: true,
          message: "/application/:id/deleterule"
        };
      } else {
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (e) {
      ctx.body = {
        code: 500,
        success: false,
        message: String(e)
      };
    }
  });

  return function (_x9) {
    return _ref9.apply(this, arguments);
  };
}());
var _default = api;
exports.default = _default;