import Koa from "koa";
import Router from 'koa-router'
import Session from 'koa-session'
import auth from './src/middleware/auth'

const SESSION_CONFIG = {
    key: 'iporte:sess',   //cookie key (default is koa:sess)
    maxAge: 86400000,  // cookie的过期时间 maxAge in ms (default is 1 days)
    overwrite: true,  //是否可以overwrite    (默认default true)
    httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,   //签名默认true
    rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
    renew: false,  //(boolean) renew session when session is nearly expired,
 };

const app = new Koa();
const router = new Router
app.keys = ['WDNMD'];

app.use(Session(SESSION_CONFIG, app));

app.use(auth())

app.use(ctx => {
  ctx.body = "Hello Koa";
});

app.listen(3000);
