import Router from "koa-router";
import Json from "koa-json";
import {
  queryApplicationsList,
  queryApplicationsIncrementalStatistics,
  addApplications,
  addApplicationsIncrementalStatistics
} from "../service/applications";

let api = new Router();
api.use(Json());

api.get("/", async ctx => {
  ctx.body = "API Index";
});

api.get("/sys/user-info", async ctx => {
  ctx.body = {
    code: 200,
    success: true,
    username: ctx.session.username
  };
});

api.get("/application/list", async ctx => {
  let data = await queryApplicationsList(ctx);
  ctx.body = {
    code: 200,
    success: true,
    data
  };
});

api.post("/application/add", async ctx => {
  try {
    let IncrementalStatistics = await queryApplicationsIncrementalStatistics(
      ctx
    );
    let pushData = {
      id: IncrementalStatistics + 1,
      status: 1,
      ...ctx.request.body
    };
    await addApplications(ctx, pushData);
    await addApplicationsIncrementalStatistics(ctx);
    ctx.body = {
      code: 200,
      success: true
    };
  } catch (e) {
    ctx.Logger.error("/api/application/add false");
    ctx.body = {
      code: 500,
      success: false,
      message: String(e)
    };
  }
});

export default api;
