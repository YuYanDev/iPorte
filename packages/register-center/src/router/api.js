import Router  from 'koa-router'
import Json from 'koa-json'

let api = new Router();
api.use(Json())
api.get("/", async ctx => {
  ctx.body = "test api";
});

api.get("/sys/user-info", async ctx => {
    ctx.body = {
        username: ctx.session.username
    }
});


export default api