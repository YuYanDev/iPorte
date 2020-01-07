"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _koaRouter = require("koa-router");

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaJson = require("koa-json");

var _koaJson2 = _interopRequireDefault(_koaJson);

var _applications = require("../dao/applications");

var _applications2 = require("../service/applications");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var api = new _koaRouter2.default();
api.use((0, _koaJson2.default)());

api.get("/", function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.body = "API Index";

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

api.get("/sys/user-info", function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ctx) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            ctx.body = {
              code: 200,
              success: true,
              username: ctx.session.username
            };

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());

api.get("/application/list", function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(ctx) {
    var data;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _applications.getApplicationsList)(ctx);

          case 2:
            data = _context3.sent;

            ctx.body = {
              code: 200,
              success: true,
              data: data
            };

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());

api.post("/application/add", function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(ctx) {
    var reqObj, data, newData, pushData;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            reqObj = ctx.request.body;

            if (!(!reqObj.name || !reqObj.domain)) {
              _context4.next = 5;
              break;
            }

            ctx.status = 400;
            ctx.body = {
              code: 400,
              success: false,
              message: "Field is missing"
            };
            return _context4.abrupt("return");

          case 5:
            _context4.prev = 5;
            _context4.next = 8;
            return (0, _applications.getApplicationsList)(ctx);

          case 8:
            data = _context4.sent;

            if (!data) {
              _context4.next = 24;
              break;
            }

            newData = _.cloneDeep(data);
            // Check Domain Duplicates

            if (!(0, _applications2.checkDomainDuplicates)(data.applications, reqObj.domain)) {
              _context4.next = 15;
              break;
            }

            ctx.status = 400;
            ctx.body = {
              code: 400,
              success: false,
              message: "Duplicate domain name"
            };
            return _context4.abrupt("return");

          case 15:
            pushData = (0, _extends3.default)({
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
            _context4.next = 21;
            return (0, _applications.setApplicationsList)(ctx, newData);

          case 21:
            // TODO: Add Domain Broadcast
            ctx.body = {
              code: 200,
              success: true,
              message: "add success"
            };
            _context4.next = 26;
            break;

          case 24:
            ctx.status = 500;
            ctx.body = {
              code: 500,
              success: false,
              message: "Database error"
            };

          case 26:
            _context4.next = 32;
            break;

          case 28:
            _context4.prev = 28;
            _context4.t0 = _context4["catch"](5);

            ctx.status = 500;
            ctx.body = {
              code: 500,
              success: false,
              message: String(_context4.t0)
            };

          case 32:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[5, 28]]);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());

api.post("/application/edit", function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ctx) {
    var reqObj, data, newData, newApplicationData;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            reqObj = ctx.request.body;

            if (reqObj.id) {
              _context5.next = 5;
              break;
            }

            ctx.status = 400;
            ctx.body = {
              code: 400,
              success: false,
              message: "Field is missing"
            };
            return _context5.abrupt("return");

          case 5:
            _context5.prev = 5;
            _context5.next = 8;
            return (0, _applications.getApplicationsList)(ctx);

          case 8:
            data = _context5.sent;

            if (!data) {
              _context5.next = 18;
              break;
            }

            newData = _.cloneDeep(data);
            newApplicationData = (0, _applications2.changeApplicationInfoById)(newData, reqObj);

            newData.applications = newApplicationData;
            _context5.next = 15;
            return (0, _applications.setApplicationsList)(ctx, newData);

          case 15:
            // TODO: edit Domain Broadcast
            ctx.body = {
              code: 200,
              success: true,
              message: "edit success"
            };
            _context5.next = 20;
            break;

          case 18:
            ctx.status = 500;
            ctx.body = {
              code: 500,
              success: false,
              message: "Database error"
            };

          case 20:
            _context5.next = 26;
            break;

          case 22:
            _context5.prev = 22;
            _context5.t0 = _context5["catch"](5);

            ctx.status = 500;
            ctx.body = {
              code: 500,
              success: false,
              message: String(_context5.t0)
            };

          case 26:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[5, 22]]);
  }));

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}());

api.post("/application/changestatus", function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(ctx) {
    var reqObj, data, newData, newApplicationData;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            reqObj = ctx.request.body;

            if (!(!reqObj.id || !(reqObj.status === 1 || reqObj.status === 0))) {
              _context6.next = 5;
              break;
            }

            ctx.status = 400;
            ctx.body = {
              code: 400,
              success: false,
              message: "Field is missing"
            };
            return _context6.abrupt("return");

          case 5:
            _context6.prev = 5;
            _context6.next = 8;
            return (0, _applications.getApplicationsList)(ctx);

          case 8:
            data = _context6.sent;

            if (!data) {
              _context6.next = 18;
              break;
            }

            newData = _.cloneDeep(data);
            newApplicationData = (0, _applications2.changeApplicationStatusById)(newData, reqObj.id, reqObj.status);

            newData.applications = newApplicationData;
            _context6.next = 15;
            return (0, _applications.setApplicationsList)(ctx, newData);

          case 15:
            // TODO: updown Domain Broadcast
            ctx.body = {
              code: 200,
              success: true,
              message: "changestatus success"
            };
            _context6.next = 20;
            break;

          case 18:
            ctx.status = 500;
            ctx.body = {
              code: 500,
              success: false,
              message: "Database error"
            };

          case 20:
            _context6.next = 26;
            break;

          case 22:
            _context6.prev = 22;
            _context6.t0 = _context6["catch"](5);

            ctx.status = 500;
            ctx.body = {
              code: 500,
              success: false,
              message: String(_context6.t0)
            };

          case 26:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[5, 22]]);
  }));

  return function (_x6) {
    return _ref6.apply(this, arguments);
  };
}());

api.post("/application/delete", function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(ctx) {
    var reqObj, data, newData, newApplicationData;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            reqObj = ctx.request.body;

            if (reqObj.id) {
              _context7.next = 5;
              break;
            }

            ctx.status = 400;
            ctx.body = {
              code: 400,
              success: false,
              message: "Field is missing"
            };
            return _context7.abrupt("return");

          case 5:
            _context7.prev = 5;
            _context7.next = 8;
            return (0, _applications.getApplicationsList)(ctx);

          case 8:
            data = _context7.sent;

            if (!data) {
              _context7.next = 19;
              break;
            }

            newData = _.cloneDeep(data);
            newApplicationData = (0, _applications2.deleteApplicationById)(newData, reqObj.id);

            newData.applications = newApplicationData;
            newData.application_total = data.application_total - 1;
            _context7.next = 16;
            return (0, _applications.setApplicationsList)(ctx, newData);

          case 16:
            // TODO: updown Domain Broadcast
            ctx.body = {
              code: 200,
              success: true,
              message: "delete success"
            };
            _context7.next = 21;
            break;

          case 19:
            ctx.status = 500;
            ctx.body = {
              code: 500,
              success: false,
              message: "Database error"
            };

          case 21:
            _context7.next = 27;
            break;

          case 23:
            _context7.prev = 23;
            _context7.t0 = _context7["catch"](5);

            ctx.status = 500;
            ctx.body = {
              code: 500,
              success: false,
              message: String(_context7.t0)
            };

          case 27:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[5, 23]]);
  }));

  return function (_x7) {
    return _ref7.apply(this, arguments);
  };
}());

api.post("/application/:id/addrule", function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(ctx) {
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            ctx.body = {
              code: 200,
              success: true,
              message: "/application/id/addrule"
            };

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function (_x8) {
    return _ref8.apply(this, arguments);
  };
}());

api.post("/application/changerulestatus", function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(ctx) {
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            ctx.body = {
              code: 200,
              success: true,
              message: "/application/changerulestatus"
            };

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function (_x9) {
    return _ref9.apply(this, arguments);
  };
}());

api.post("/application/:id/editrule", function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(ctx) {
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            ctx.body = {
              code: 200,
              success: true,
              message: "/application/id/editrule"
            };

          case 1:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function (_x10) {
    return _ref10.apply(this, arguments);
  };
}());

api.post("/application/:id/deleterule", function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(ctx) {
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            ctx.body = {
              code: 200,
              success: true,
              message: "/application/:id/deleterule"
            };

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  }));

  return function (_x11) {
    return _ref11.apply(this, arguments);
  };
}());

exports.default = api;