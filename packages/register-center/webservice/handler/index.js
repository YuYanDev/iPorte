import Router from "koa-router";

let index = new Router();

index.get("/", async ctx => {
    await ctx.render('index.html')
});

export default index;