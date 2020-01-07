"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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
    var data = yield (0, _applications.getApplicationsList)(ctx);
    ctx.body = {
      code: 200,
      success: true,
      data
    };
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
      ctx.status = 400;
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
        var newData = _.cloneDeep(data); // Check Domain Duplicates


        if ((0, _applications2.checkDomainDuplicates)(data.applications, reqObj.domain)) {
          ctx.status = 400;
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
        yield (0, _applications.setApplicationsList)(ctx, newData); // TODO: Add Domain Broadcast

        ctx.body = {
          code: 200,
          success: true,
          message: "add success"
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (E) {
      ctx.status = 500;
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
      ctx.status = 400;
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
        var newData = _.cloneDeep(data);

        var newApplicationData = (0, _applications2.changeApplicationInfoById)(newData, reqObj);
        newData.applications = newApplicationData;
        yield (0, _applications.setApplicationsList)(ctx, newData); // TODO: edit Domain Broadcast

        ctx.body = {
          code: 200,
          success: true,
          message: "edit success"
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (E) {
      ctx.status = 500;
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
      ctx.status = 400;
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
        var newData = _.cloneDeep(data);

        var newApplicationData = (0, _applications2.changeApplicationStatusById)(newData, reqObj.id, reqObj.status);
        newData.applications = newApplicationData;
        yield (0, _applications.setApplicationsList)(ctx, newData); // TODO: updown Domain Broadcast

        ctx.body = {
          code: 200,
          success: true,
          message: "changestatus success"
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (E) {
      ctx.status = 500;
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
      ctx.status = 400;
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
        var newData = _.cloneDeep(data);

        var newApplicationData = (0, _applications2.deleteApplicationById)(newData, reqObj.id);
        newData.applications = newApplicationData;
        newData.application_total = data.application_total - 1;
        yield (0, _applications.setApplicationsList)(ctx, newData); // TODO: updown Domain Broadcast

        ctx.body = {
          code: 200,
          success: true,
          message: "delete success"
        };
      } else {
        ctx.status = 500;
        ctx.body = {
          code: 500,
          success: false,
          message: "Database error"
        };
      }
    } catch (E) {
      ctx.status = 500;
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
    ctx.body = {
      code: 200,
      success: true,
      message: "/application/id/addrule"
    };
  });

  return function (_x8) {
    return _ref8.apply(this, arguments);
  };
}());
api.post("/application/changerulestatus",
/*#__PURE__*/
function () {
  var _ref9 = (0, _asyncToGenerator2.default)(function* (ctx) {
    ctx.body = {
      code: 200,
      success: true,
      message: "/application/changerulestatus"
    };
  });

  return function (_x9) {
    return _ref9.apply(this, arguments);
  };
}());
api.post("/application/:id/editrule",
/*#__PURE__*/
function () {
  var _ref10 = (0, _asyncToGenerator2.default)(function* (ctx) {
    ctx.body = {
      code: 200,
      success: true,
      message: "/application/id/editrule"
    };
  });

  return function (_x10) {
    return _ref10.apply(this, arguments);
  };
}());
api.post("/application/:id/deleterule",
/*#__PURE__*/
function () {
  var _ref11 = (0, _asyncToGenerator2.default)(function* (ctx) {
    ctx.body = {
      code: 200,
      success: true,
      message: "/application/:id/deleterule"
    };
  });

  return function (_x11) {
    return _ref11.apply(this, arguments);
  };
}());
var _default = api;
exports.default = _default;