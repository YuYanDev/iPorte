// npm lib
import path from "path";
import IO from "koa-socket-2";
import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Router from "koa-router";
import Session from "koa-session";
import Views from "koa-views";
import Static from "koa-static";
import Mount from "koa-mount";
// common service
import loadConfigObjFromToml from "./service/readToml";
import startRedis from "./service/startRedis";
import LoggerCore from "./service/logger";
// koa handler
import apiRouter from "./webservice/handler/api";
import indexRouter from "./webservice/handler/index";
// koa middleware
import Auth from "./webService/middleware/auth";
import Logger from "./webservice/middleware/logger";
import RedisDBMiddleWare from "./webservice/middleware/redisDB";
import BroadcastMiddleWare from "./webservice/middleware/broadcast";
// constants
import { SESSION_CONFIG } from "./constants";

class RegisterCenter {
  constructor() {
    console.log(
      "\n------------------------------ Start RegisterCenter ------------------------------\n"
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
    this.gateList = [];
  }

  /**
   * Read Register Center config from toml file
   */
  async loadRegisterCenterConfig() {
    LoggerCore.majorinfo(`Reading constants from a config file`);
    this.config = await loadConfigObjFromToml(
      path.join(__dirname, "config.toml")
    );
  }

  startRedisService() {
    LoggerCore.majorinfo(`Starting Redis Service`);
    this.db = startRedis(this.config.redis);
  }

  broadcastRouterTable() {
    console.log("xxxxx", this.socketService);
    this.socketService.emit("UpdateRoute", { msg: "bord" });
  }

  /**
   * load Web Service (Koa Server)
   */
  loadWebService() {
    LoggerCore.majorinfo(`Starting Web Service`);
    this.webService = new Koa();
    this.webServiceRouter = new Router();
    this.webService.keys = ["WDNMD"];

    const io = new IO();
    io.attach(this.webService);
    io.on("connect", (client) => {
      client.on("message", async (message) => {
        console.log(message);
      });
    });

    io.on("registered", async (ctx, msg) => {
      const data = ctx.data;
      let nodeInfo = {
        ...data,
        clientId: Object.keys(ctx.socket.rooms)[0],
      };
      if (data && data.trustToken !== this.config.TrustToken) {
        LoggerCore.warn(
          "Handshake failed, keys do not match: " + JSON.stringify(nodeInfo)
        );
        io.to(nodeInfo.clientId).emit("rejection_token");
      } else {
        LoggerCore.majorinfo(
          "Received registration request from Gate Node: " +
            JSON.stringify(nodeInfo)
        );
        this.db.get("IPorte_Applications", (err, data) => {
          if (err) {
            LoggerCore.error(String(err));
            io.to(nodeInfo.clientId).emit("RouterConfig", {
              error: String(err),
            });
          }

          io.to(nodeInfo.clientId).emit("RouterConfig", {
            success: true,
            data: JSON.parse(data).applications,
          });
        });
        this.gateList.push({ ...nodeInfo, status: 1 });
        LoggerCore.majorinfo(
          'Gate Node "' + nodeInfo.id + '" registered successfully'
        );
      }
    });

    io.on("updateConfig", async (ctx, data) => {
      LoggerCore.info("Updateing Config");
      ctx.socket.broadcast.emit("UpdateRoute", { data });
    });

    /** MiddleWare */
    this.webService.use(BodyParser());
    this.webService.use(Session(SESSION_CONFIG, this.webService));
    this.webService.use(Logger());
    this.webService.use(RedisDBMiddleWare(this.db));
    this.webService.use(Views(path.join(__dirname, "./webservice/view")));
    this.webService.use(Auth());
    this.webService.use(BroadcastMiddleWare());
    this.webService.use(
      Mount(
        "/static",
        Static(path.join(__dirname, "./webservice/view/static/"))
      )
    );

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

    this.webService.listen(Number(this.config.port));
  }

  async start() {
    await this.initConst();
    await this.loadRegisterCenterConfig();
    await this.startRedisService();
    await this.loadWebService();
  }
}

new RegisterCenter();
