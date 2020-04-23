"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _http = _interopRequireDefault(require("http"));

var _path = _interopRequireDefault(require("path"));

var _httpProxy = _interopRequireDefault(require("http-proxy"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _util = require("./src/util");

var _logger = _interopRequireDefault(require("./src/logger"));

var _readToml = _interopRequireDefault(require("./src/readToml"));

var Gate =
/*#__PURE__*/
function () {
  function Gate() {
    (0, _classCallCheck2.default)(this, Gate);
    console.log("\n----------------------------------- Start Gate -----------------------------------\n");
    this.start();
  }
  /**
   * Init status
   */


  (0, _createClass2.default)(Gate, [{
    key: "initConst",
    value: function initConst() {
      this.gateServer = null;
      this.proxyServer = null;
      this.socketClient = null;
      this.routingTable = [];
      this.config = null;
    }
  }, {
    key: "loadGateConfig",
    value: function () {
      var _loadGateConfig = (0, _asyncToGenerator2.default)(function* () {
        _logger.default.majorinfo("Reading constants from a config file");

        this.config = yield (0, _readToml.default)(_path.default.join(__dirname, "config.toml"));
      });

      function loadGateConfig() {
        return _loadGateConfig.apply(this, arguments);
      }

      return loadGateConfig;
    }()
  }, {
    key: "establishSocket",
    value: function establishSocket() {
      var _this = this;

      this.socketClient = (0, _socket.default)(this.config.RegisterCenter, {
        reconnection: true,
        reconnectionDelayMax: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });
      this.socketClient.on("connect", function () {
        _this.socketClient.emit("registered", {
          id: _this.config.NodeId,
          trustToken: _this.config.TrustToken
        });

        _logger.default.info("Establish a socket connection with the registry");
      });
      this.socketClient.on("disconnect", function () {
        _logger.default.warn("Close connection");
      });
      this.socketClient.on("UpdateRoute",
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(function* (message) {
          _logger.default.info("New version of routing table received");

          var {
            applications = []
          } = message.data;
          _this.routingTable = applications;
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      this.socketClient.on("rejection_token",
      /*#__PURE__*/
      function () {
        var _ref2 = (0, _asyncToGenerator2.default)(function* (msg) {
          _logger.default.warn("Wrong key, unable to establish connection");

          _this.socketClient.close();
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }());
      this.socketClient.on("RouterConfig",
      /*#__PURE__*/
      function () {
        var _ref3 = (0, _asyncToGenerator2.default)(function* (routerConfig) {
          _logger.default.info("Receive the configuration sent from the registry"); // console.log("routerTable", JSON.stringify(routerConfig.data));


          _this.routingTable = routerConfig.data;
        });

        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      }());
      this.socketClient.on("reconnecting", function (attemptNumber) {
        _logger.default.warn("Unable to connect to the Registry Center, retrying, ".concat(attemptNumber, "th time"));
      });
      this.socketClient.on("reconnect_failed", function () {
        _logger.default.error("Retry reached maximum limit, reconnect failed");
      });
      this.routingTable = [];
    }
  }, {
    key: "createServer",
    value: function createServer() {
      var _this2 = this;

      this.proxyServer = _httpProxy.default.createProxyServer({});
      this.proxyServer.on("error", function (err, req, res) {
        res.writeHead(500, {
          "Content-Type": "text/plain"
        });

        _logger.default.error(String(err));

        res.end("Something went wrong. And we are reporting a custom error message.");
      });
      this.gateServer = _http.default.createServer(function (req, res) {
        var host = req.headers.host;
        var url = req.url;

        var hostRule = _this2.routingTable.find(function (x) {
          return x.domain === host;
        });

        if (hostRule === undefined || hostRule.status === 0 || hostRule && hostRule.rule_total === 0) {
          res.writeHead(404, {
            "Content-Type": "text/plain"
          });

          _logger.default.warn("Domain: " + host + " ,Path: " + url + " ,Info: Not Found!" + " ;");

          res.end("Not Found!");
        } else {
          var ruleRule = (0, _util.findRuleTargetByUrl)(hostRule.rule, url);

          if (ruleRule === undefined || ruleRule && ruleRule.status === 0) {
            res.writeHead(404, {
              "Content-Type": "text/plain"
            });

            _logger.default.warn("Domain: " + host + " ,Path: " + url + " ,Info: Not Found!" + " ;");

            res.end("Not Found!");
          } else {
            _logger.default.info("Domain: " + host + " ,Path: " + url + " ,MatchRule: " + ruleRule.suffix + " ,Target: " + ruleRule.target + " ;");

            _this2.proxyServer.web(req, res, {
              target: ruleRule.target
            });
          }
        }
      });
      this.gateServer.listen(this.config.listen);
    }
  }, {
    key: "start",
    value: function () {
      var _start = (0, _asyncToGenerator2.default)(function* () {
        yield this.initConst();
        yield this.loadGateConfig();
        yield this.establishSocket();
        yield this.createServer();
      });

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }()
  }]);
  return Gate;
}();

new Gate();