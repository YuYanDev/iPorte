import Koa from "koa";
import BodyParser from "koa-bodyparser"
import Router from "koa-router";
import Session from "koa-session";
import path from "path";
import loadConfigObjFromToml from "./service/readToml";
import startRedis from "./service/startRedis";
import apiRouter from "./webservice/handler/api";
import Auth from "./webService/middleware/auth";
import Logger from './webservice/middleware/logger'
import RedisDBMiddleWare from './webservice/middleware/redisDB'
import { SESSION_CONFIG } from "./constants";

class RegisterCenter {
  constructor() {
    this.start();
  }

  /**
   * Init status
   */
  initConst() {
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
    this.webService.use(BodyParser())
    this.webService.use(Session(SESSION_CONFIG, this.webService));
    this.webService.use(Logger())
    this.webService.use(RedisDBMiddleWare(this.db))
    this.webService.use(Auth());

    this.webServiceRouter.use(
      "/api",
      apiRouter.routes(),
      apiRouter.allowedMethods()
    );
    this.webService
      .use(this.webServiceRouter.routes())
      .use(this.webServiceRouter.allowedMethods());

    this.webService.use(ctx => {
      ctx.body = "Hello Koa";
    });

    this.webService.listen(8080);
  }

  async start() {
    await this.initConst();
    await this.loadRegisterCenterConfig();
    await this.startRedisService()
    console.log("Config:", this.config);
    await this.loadWebService();
  }
}

new RegisterCenter();
