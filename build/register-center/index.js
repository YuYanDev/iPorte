"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = _interopRequireDefault(require("path"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

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

var _constants = require("./constants");

// npm lib
// common service
// koa handler
// koa middleware
// constants
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
    }
    /**
     * Read Register Center config from toml file
     */

  }, {
    key: "loadRegisterCenterConfig",
    value: function () {
      var _loadRegisterCenterConfig = (0, _asyncToGenerator2.default)(function* () {
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
      this.db = (0, _startRedis.default)(this.config.redis);
    }
    /**
     * load Web Service (Koa Server)
     */

  }, {
    key: "loadWebService",
    value: function loadWebService() {
      this.webService = new _koa.default();
      this.webServiceRouter = new _koaRouter.default();
      this.webService.keys = ["WDNMD"];
      /** MiddleWare */

      this.webService.use((0, _koaBodyparser.default)());
      this.webService.use((0, _koaSession.default)(_constants.SESSION_CONFIG, this.webService));
      this.webService.use((0, _logger2.default)());
      this.webService.use((0, _redisDB.default)(this.db));
      this.webService.use((0, _koaViews.default)(_path.default.join(__dirname, './webservice/view'))); // this.webService.use(Auth());

      this.webService.use((0, _koaMount.default)('/static', (0, _koaStatic.default)(_path.default.join(__dirname, './webservice/view/static/'))));
      /** Handler | Router */

      this.webServiceRouter.use("/api", _api.default.routes(), _api.default.allowedMethods());
      this.webServiceRouter.use("/", _index.default.routes(), _index.default.allowedMethods());
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

      this.webServer = _http.default.createServer(this.webService.callback());
      this.socketService = (0, _socket.default)(this.webServer);
      this.webServer.listen(Number(this.config.port), function () {
        _logger.default.info("RegisterCenter Server Start");

        _logger.default.info("listening ".concat(_this.config.port));
      });
    }
  }, {
    key: "start",
    value: function () {
      var _start = (0, _asyncToGenerator2.default)(function* () {
        yield this.initConst();
        yield this.loadRegisterCenterConfig();
        yield this.startRedisService();
        yield this.loadWebService();
        yield this.loadWebServer();
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