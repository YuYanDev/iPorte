import Router from "koa-router";
import Json from "koa-json";
import testdata from "../../../../docs/demo/demo_config.json";

let api = new Router();
api.use(Json());

api.get("/", async ctx => {
  ctx.body = "test api";
  ctx.Logger.info("test api info");
});

api.get("/sys/user-info", async ctx => {
  ctx.body = {
    username: ctx.session.username
  };
});

api.get("/application/list", async ctx => {
  ctx.body = testdata;
});

export default api;
