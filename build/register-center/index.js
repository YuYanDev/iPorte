"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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
class RegisterCenter {
  constructor() {
    console.log("------------------------------ Start RegisterCenter ------------------------------");
    this.start();
  }
  /**
   * Init status
   */


  initConst() {
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


  loadRegisterCenterConfig() {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      _this.config = yield (0, _readToml.default)(_path.default.join(__dirname, "config.toml"));
      console.log("Config:", _this.config);
    })();
  }

  startRedisService() {
    this.db = (0, _startRedis.default)(this.config.redis);
  }
  /**
   * load Web Service (Koa Server)
   */


  loadWebService() {
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


  loadWebServer() {
    this.webServer = _http.default.createServer(this.webService.callback());
    this.socketService = (0, _socket.default)(this.webServer);
    this.webServer.listen(Number(this.config.port), () => {
      _logger.default.info("Server Start");

      _logger.default.info("listening ".concat(this.config.port));
    });
  }

  start() {
    var _this2 = this;

    return (0, _asyncToGenerator2.default)(function* () {
      yield _this2.initConst();
      yield _this2.loadRegisterCenterConfig();
      yield _this2.startRedisService();
      yield _this2.loadWebService();
      yield _this2.loadWebServer();
    })();
  }

}

new RegisterCenter();