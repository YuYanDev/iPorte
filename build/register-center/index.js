"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var _koaSocket = _interopRequireDefault(require("koa-socket-2"));

var _koa = _interopRequireDefault(require("koa"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _koaSession = _interopRequireDefault(require("koa-session"));

var _koaViews = _interopRequireDefault(require("koa-views"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _koaMount = _interopRequireDefault(require("koa-mount"));

var _readToml = _interopRequireDefault(require("./service/readToml"));

var _startRedis = _interopRequireDefault(require("./service/startRedis"));

var _logger = _interopRequireDefault(require("./service/logger"));

var _api = _interopRequireDefault(require("./webservice/handler/api"));

var _index = _interopRequireDefault(require("./webservice/handler/index"));

var _auth = _interopRequireDefault(require("./webService/middleware/auth"));

var _logger2 = _interopRequireDefault(require("./webservice/middleware/logger"));

var _redisDB = _interopRequireDefault(require("./webservice/middleware/redisDB"));

var _broadcast = _interopRequireDefault(require("./webservice/middleware/broadcast"));

var _constants = require("./constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var RegisterCenter =
/*#__PURE__*/
function () {
  function RegisterCenter() {
    (0, _classCallCheck2.default)(this, RegisterCenter);
    console.log("\n------------------------------ Start RegisterCenter ------------------------------\n");
    this.start();
  }
  /**
   * Init status
   */


  (0, _createClass2.default)(RegisterCenter, [{
    key: "initConst",
    value: function initConst() {
      this.webServer = null;
      this.socketService = null;
      this.webService = null;
      this.webServiceRouter = null;
      this.config = null;
      this.db = null;
      this.gateList = [];
    }
    /**
     * Read Register Center config from toml file
     */

  }, {
    key: "loadRegisterCenterConfig",
    value: function () {
      var _loadRegisterCenterConfig = (0, _asyncToGenerator2.default)(function* () {
        _logger.default.majorinfo("Reading constants from a config file");

        this.config = yield (0, _readToml.default)(_path.default.join(__dirname, "config.toml"));
      });

      function loadRegisterCenterConfig() {
        return _loadRegisterCenterConfig.apply(this, arguments);
      }

      return loadRegisterCenterConfig;
    }()
  }, {
    key: "startRedisService",
    value: function startRedisService() {
      _logger.default.majorinfo("Starting Redis Service");

      this.db = (0, _startRedis.default)(this.config.redis);
    }
  }, {
    key: "broadcastRouterTable",
    value: function broadcastRouterTable() {
      console.log("xxxxx", this.socketService);
      this.socketService.emit("UpdateRoute", {
        msg: "bord"
      });
    }
    /**
     * load Web Service (Koa Server)
     */

  }, {
    key: "loadWebService",
    value: function loadWebService() {
      var _this = this;

      _logger.default.majorinfo("Starting Web Service");

      this.webService = new _koa.default();
      this.webServiceRouter = new _koaRouter.default();
      this.webService.keys = ["WDNMD"];
      var io = new _koaSocket.default();
      io.attach(this.webService);
      io.on("connect", function (client) {
        client.on("message",
        /*#__PURE__*/
        function () {
          var _ref = (0, _asyncToGenerator2.default)(function* (message) {
            console.log(message);
          });

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      });
      io.on("registered",
      /*#__PURE__*/
      function () {
        var _ref2 = (0, _asyncToGenerator2.default)(function* (ctx, msg) {
          var data = ctx.data;

          var nodeInfo = _objectSpread({}, data, {
            clientId: Object.keys(ctx.socket.rooms)[0]
          });

          if (data && data.trustToken !== _this.config.TrustToken) {
            _logger.default.warn("Handshake failed, keys do not match: " + JSON.stringify(nodeInfo));

            io.to(nodeInfo.clientId).emit("rejection_token");
          } else {
            _logger.default.majorinfo("Received registration request from Gate Node: " + JSON.stringify(nodeInfo));

            _this.db.get("IPorte_Applications", function (err, data) {
              if (err) {
                _logger.default.error(String(err));

                io.to(nodeInfo.clientId).emit("RouterConfig", {
                  error: String(err)
                });
              }

              io.to(nodeInfo.clientId).emit("RouterConfig", {
                success: true,
                data: JSON.parse(data).applications
              });
            });

            _this.gateList.push(_objectSpread({}, nodeInfo, {
              status: 1
            }));

            _logger.default.majorinfo('Gate Node "' + nodeInfo.id + '" registered successfully');
          }
        });

        return function (_x2, _x3) {
          return _ref2.apply(this, arguments);
        };
      }());
      io.on("updateConfig",
      /*#__PURE__*/
      function () {
        var _ref3 = (0, _asyncToGenerator2.default)(function* (ctx, data) {
          _logger.default.info("Updateing Config");

          ctx.socket.broadcast.emit("UpdateRoute", {
            data
          });
        });

        return function (_x4, _x5) {
          return _ref3.apply(this, arguments);
        };
      }());
      /** MiddleWare */

      this.webService.use((0, _koaBodyparser.default)());
      this.webService.use((0, _koaSession.default)(_constants.SESSION_CONFIG, this.webService));
      this.webService.use((0, _logger2.default)());
      this.webService.use((0, _redisDB.default)(this.db));
      this.webService.use((0, _koaViews.default)(_path.default.join(__dirname, "./webservice/view")));
      this.webService.use((0, _auth.default)());
      this.webService.use((0, _broadcast.default)());
      this.webService.use((0, _koaMount.default)("/static", (0, _koaStatic.default)(_path.default.join(__dirname, "./webservice/view/static/"))));
      /** Handler | Router */

      this.webServiceRouter.use("/api", _api.default.routes(), _api.default.allowedMethods());
      this.webServiceRouter.use("/", _index.default.routes(), _index.default.allowedMethods());
      this.webService.use(this.webServiceRouter.routes()).use(this.webServiceRouter.allowedMethods());
      this.webService.listen(Number(this.config.port));
    }
  }, {
    key: "start",
    value: function () {
      var _start = (0, _asyncToGenerator2.default)(function* () {
        yield this.initConst();
        yield this.loadRegisterCenterConfig();
        yield this.startRedisService();
        yield this.loadWebService();
      });

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }()
  }]);
  return RegisterCenter;
}();

new RegisterCenter();