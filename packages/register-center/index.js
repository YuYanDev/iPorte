// npm lib
import path from "path";
import http from "http";
import socketio from "socket.io";
import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Router from "koa-router";
import Session from "koa-session";
import Views from "koa-views"
import Static from "koa-static"
import Mount from "koa-mount"
// common service
import loadConfigObjFromToml from "./service/readToml";
import startRedis from "./service/startRedis";
import LoggerCore from "./service/logger";
// koa handler
import apiRouter from "./webservice/handler/api";
import indexRouter from "./webservice/handler/index"
// koa middleware
import Auth from "./webService/middleware/auth";
import Logger from "./webservice/middleware/logger";
import RedisDBMiddleWare from "./webservice/middleware/redisDB";
// constants
import { SESSION_CONFIG } from "./constants";

class RegisterCenter {
  constructor() {
    console.log(
      "------------------------------ Start RegisterCenter ------------------------------"
    );
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
  async loadRegisterCenterConfig() {
    this.config = await loadConfigObjFromToml(
      path.join(__dirname, "config.toml")
    );
    console.log("Config:", this.config);
  }

  startRedisService() {
    this.db = startRedis(this.config.redis);
  }

  /**
   * load Web Service (Koa Server)
   */
  loadWebService() {
    this.webService = new Koa();
    this.webServiceRouter = new Router();
    this.webService.keys = ["WDNMD"];

    /** MiddleWare */
    this.webService.use(BodyParser());
    this.webService.use(Session(SESSION_CONFIG, this.webService));
    this.webService.use(Logger());
    this.webService.use(RedisDBMiddleWare(this.db));
    this.webService.use(Views(path.join(__dirname, './webservice/view')))
    // this.webService.use(Auth());
    this.webService.use(Mount('/static',Static(path.join(__dirname, './webservice/view/static/'))))
    
    /** Handler | Router */
    this.webServiceRouter.use(
      "/api",
      apiRouter.routes(),
      apiRouter.allowedMethods()
    );
    this.webServiceRouter.use(
      "/",
      indexRouter.routes(),
      indexRouter.allowedMethods()
    );

    this.webService
      .use(this.webServiceRouter.routes())
      .use(this.webServiceRouter.allowedMethods());
  }

  /**
   * load Web Server
   * HTTP Server && Socket Server
   */
  loadWebServer() {
    this.webServer = http.createServer(this.webService.callback());
    this.socketService = socketio(this.webServer);
    this.webServer.listen(Number(this.config.port), () => {
      LoggerCore.info(`Server Start`);
      LoggerCore.info(`listening ${this.config.port}`);
    });
  }

  async start() {
    await this.initConst();
    await this.loadRegisterCenterConfig();
    await this.startRedisService();
    await this.loadWebService();
    await this.loadWebServer();
  }
}

new RegisterCenter();
