import http from "http";
import path from "path";
import httpProxy from "http-proxy";
import io from "socket.io-client";
import { findRuleTargetByUrl } from "./src/util";
import Logger from "./src/logger";
import loadConfigObjFromToml from "./src/readToml";

class Gate {
  constructor() {
    console.log(
      "\n----------------------------------- Start Gate -----------------------------------\n"
    );
    this.start();
  }

  /**
   * Init status
   */
  initConst() {
    this.gateServer = null;
    this.proxyServer = null;
    this.socketClient = null;
    this.routingTable = [];
    this.config = null;
  }

  async loadGateConfig() {
    Logger.majorinfo(`Reading constants from a config file`);
    this.config = await loadConfigObjFromToml(
      path.join(__dirname, "config.toml")
    );
  }

  establishSocket() {
    this.socketClient = io(this.config.RegisterCenter, {
      reconnection: true,
      reconnectionDelayMax: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socketClient.on("connect", () => {
      this.socketClient.emit("registered", {
        id: this.config.NodeId,
        trustToken: this.config.TrustToken
      });
      Logger.info("Establish a socket connection with the registry");
    });

    this.socketClient.on("disconnect", () => {
      Logger.warn("Close connection");
    });

    this.socketClient.on("UpdateRoute", async message => {
      Logger.info("New version of routing table received");
      const { applications = [] } = message.data
      this.routingTable = applications;
    });

    this.socketClient.on("rejection_token", async msg => {
      Logger.warn("Wrong key, unable to establish connection");
      this.socketClient.close()
    });

    this.socketClient.on("RouterConfig", async routerConfig => {
      Logger.info("Receive the configuration sent from the registry");
      console.log("routerTable", JSON.stringify(routerConfig.data));
      this.routingTable = routerConfig.data;
    });

    this.socketClient.on("reconnecting", attemptNumber => {
      Logger.warn(
        `Unable to connect to the Registry Center, retrying, ${attemptNumber}th time`
      );
    });

    this.socketClient.on("reconnect_failed", () => {
      Logger.error("Retry reached maximum limit, reconnect failed");
    });

    this.routingTable = [];
  }

  createServer() {
    this.proxyServer = httpProxy.createProxyServer({});
    this.proxyServer.on("error", (err, req, res) => {
      res.writeHead(500, {
        "Content-Type": "text/plain"
      });
      Logger.error(String(err));
      res.end(
        "Something went wrong. And we are reporting a custom error message."
      );
    });

    this.gateServer = http.createServer((req, res) => {
      let host = req.headers.host;
      let url = req.url;
      const hostRule = this.routingTable.find(x => x.domain === host);
      if (
        hostRule === undefined ||
        hostRule.status === 0 ||
        (hostRule && hostRule.rule_total === 0)
      ) {
        res.writeHead(404, {
          "Content-Type": "text/plain"
        });
        Logger.warn(
          "Domain: " + host + " ,Path: " + url + " ,Info: Not Found!" + " ;"
        );
        res.end("Not Found!");
      } else {
        const ruleRule = findRuleTargetByUrl(hostRule.rule, url);
        if (ruleRule === undefined || (ruleRule && ruleRule.status === 0)) {
          res.writeHead(404, {
            "Content-Type": "text/plain"
          });
          Logger.warn(
            "Domain: " + host + " ,Path: " + url + " ,Info: Not Found!" + " ;"
          );
          res.end("Not Found!");
        } else {
          Logger.info(
            "Domain: " +
              host +
              " ,Path: " +
              url +
              " ,MatchRule: " +
              ruleRule.suffix +
              " ,Target: " +
              ruleRule.target +
              " ;"
          );
          this.proxyServer.web(req, res, { target: ruleRule.target });
        }
      }
    });
    this.gateServer.listen(this.config.listen);
  }
  async start() {
    await this.initConst();
    await this.loadGateConfig();
    await this.establishSocket();
    await this.createServer();
  }
}

new Gate();
