"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = require("koa-bodyparser");

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaRouter = require("koa-router");

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaSession = require("koa-session");

var _koaSession2 = _interopRequireDefault(_koaSession);

var _koaViews = require("koa-views");

var _koaViews2 = _interopRequireDefault(_koaViews);

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaMount = require("koa-mount");

var _koaMount2 = _interopRequireDefault(_koaMount);

var _readToml = require("./service/readToml");

var _readToml2 = _interopRequireDefault(_readToml);

var _startRedis = require("./service/startRedis");

var _startRedis2 = _interopRequireDefault(_startRedis);

var _logger = require("./service/logger");

var _logger2 = _interopRequireDefault(_logger);

var _api = require("./webservice/handler/api");

var _api2 = _interopRequireDefault(_api);

var _index = require("./webservice/handler/index");

var _index2 = _interopRequireDefault(_index);

var _auth = require("./webService/middleware/auth");

var _auth2 = _interopRequireDefault(_auth);

var _logger3 = require("./webservice/middleware/logger");

var _logger4 = _interopRequireDefault(_logger3);

var _redisDB = require("./webservice/middleware/redisDB");

var _redisDB2 = _interopRequireDefault(_redisDB);

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// koa middleware

// koa handler
var RegisterCenter = function () {
  function RegisterCenter() {
    (0, _classCallCheck3.default)(this, RegisterCenter);

    console.log("------------------------------ Start RegisterCenter ------------------------------");
    this.start();
  }

  /**
   * Init status
   */


  (0, _createClass3.default)(RegisterCenter, [{
    key: "initConst",
    value: function initConst() {
      this.webServer = null;
      this.socketService = null;
      this.webService = null;
      this.webServiceRouter = null;
      this.config = null;
      this.db = null;
    }

    /**
     * Read Register Center config from toml file
     */

  }, {
    key: "loadRegisterCenterConfig",
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _readToml2.default)(_path2.default.join(__dirname, "config.toml"));

              case 2:
                this.config = _context.sent;

                console.log("Config:", this.config);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadRegisterCenterConfig() {
        return _ref.apply(this, arguments);
      }

      return loadRegisterCenterConfig;
    }()
  }, {
    key: "startRedisService",
    value: function startRedisService() {
      this.db = (0, _startRedis2.default)(this.config.redis);
    }

    /**
     * load Web Service (Koa Server)
     */

  }, {
    key: "loadWebService",
    value: function loadWebService() {
      this.webService = new _koa2.default();
      this.webServiceRouter = new _koaRouter2.default();
      this.webService.keys = ["WDNMD"];

      /** MiddleWare */
      this.webService.use((0, _koaBodyparser2.default)());
      this.webService.use((0, _koaSession2.default)(_constants.SESSION_CONFIG, this.webService));
      this.webService.use((0, _logger4.default)());
      this.webService.use((0, _redisDB2.default)(this.db));
      this.webService.use((0, _koaViews2.default)(_path2.default.join(__dirname, './webservice/view')));
      // this.webService.use(Auth());
      this.webService.use((0, _koaMount2.default)('/static', (0, _koaStatic2.default)(_path2.default.join(__dirname, './webservice/view/static/'))));

      /** Handler | Router */
      this.webServiceRouter.use("/api", _api2.default.routes(), _api2.default.allowedMethods());
      this.webServiceRouter.use("/", _index2.default.routes(), _index2.default.allowedMethods());

      this.webService.use(this.webServiceRouter.routes()).use(this.webServiceRouter.allowedMethods());
    }

    /**
     * load Web Server
     * HTTP Server && Socket Server
     */

  }, {
    key: "loadWebServer",
    value: function loadWebServer() {
      var _this = this;

      this.webServer = _http2.default.createServer(this.webService.callback());
      this.socketService = (0, _socket2.default)(this.webServer);
      this.webServer.listen(Number(this.config.port), function () {
        _logger2.default.info("Server Start");
        _logger2.default.info("listening " + _this.config.port);
      });
    }
  }, {
    key: "start",
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.initConst();

              case 2:
                _context2.next = 4;
                return this.loadRegisterCenterConfig();

              case 4:
                _context2.next = 6;
                return this.startRedisService();

              case 6:
                _context2.next = 8;
                return this.loadWebService();

              case 8:
                _context2.next = 10;
                return this.loadWebServer();

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function start() {
        return _ref2.apply(this, arguments);
      }

      return start;
    }()
  }]);
  return RegisterCenter;
}();
// constants

// common service
// npm lib


new RegisterCenter();