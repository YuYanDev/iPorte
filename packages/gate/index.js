import http from "http";
import httpProxy from "http-proxy";
import { findRuleTargetByUrl } from "./util";

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
    this.routingTable = [];
  }

  establishSocket() {
    this.routingTable = [
      {
        id: 4,
        name: "test2",
        domain: "test2.lolita.im",
        status: 1,
        rule_incremental_statistics: 0,
        rule_total: 0,
        rule: []
      },
      {
        id: 1,
        name: "主站API入口",
        domain: "api.lolita.im",
        status: 1,
        rule_incremental: 2,
        rule_total: 2,
        rule: [
          {
            id: 1,
            name: "注册中心转发",
            suffix: "/register-center",
            status: 1,
            rewrite: true,
            rewrite_rule: "^",
            type: "Reverse Proxy",
            target: "https://register-center.k8s.alleysakura.com"
          },
          {
            id: 2,
            name: "运维监控",
            suffix: "/bot",
            status: 0,
            rewrite: true,
            rewrite_rule: "^",
            type: "Reverse Proxy",
            target: "https://bot.gate.alleysakura.com"
          }
        ]
      },
      {
        id: 2,
        name: "主站入口",
        domain: "lolita.im",
        status: 1,
        rule_incremental: 4,
        rule_total: 4,
        rule: [
          {
            id: 1,
            name: "应用反向代理",
            suffix: "/",
            status: 1,
            rewrite: false,
            rewrite_rule: "",
            type: "Reverse Proxy",
            target: "http://localhost:8080"
          },
          {
            id: 2,
            name: "应用反向代理123123",
            suffix: "/test1",
            status: 1,
            rewrite: false,
            rewrite_rule: "",
            type: "Reverse Proxy",
            target: "https://static2.alleysakura.com"
          },
          {
            id: 3,
            name: "应用反向代理asdad",
            suffix: "/test1/testx",
            status: 1,
            rewrite: false,
            rewrite_rule: "",
            type: "Reverse Proxy",
            target: "https://static3.alleysakura.com"
          },
          {
            id: 4,
            name: "应用反向代理qweqwe",
            suffix: "/test2",
            status: 1,
            rewrite: false,
            rewrite_rule: "",
            type: "Reverse Proxy",
            target: "https://static4.alleysakura.com"
          }
        ]
      }
    ];
  }

  createServer() {
    this.proxyServer = httpProxy.createProxyServer({});
    this.proxyServer.on("error", (err, req, res) => {
      res.writeHead(500, {
        "Content-Type": "text/plain"
      });
      console.log(err);
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
        res.end("Not Found!");
      } else {
        const ruleRule = findRuleTargetByUrl(hostRule.rule, url);
        if (ruleRule === undefined || (ruleRule && ruleRule.status === 0)) {
          res.writeHead(404, {
            "Content-Type": "text/plain"
          });
          res.end("Not Found!");
        } else {
          console.log(
            "host: ",
            host,
            " path: ",
            url,
            " target: ",
            ruleRule.suffix,
            " pass"
          );
          this.proxyServer.web(req, res, { target: ruleRule.target });
        }
      }

      //   console.log(hostRule);
    });
    this.gateServer.listen(80);
  }
  async start() {
    await this.establishSocket();
    await this.createServer();
  }
}

new Gate();
