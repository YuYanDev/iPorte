import loggerCore from "../../service/logger";

const Logger = () => {
  return async (ctx, next) => {
    ctx.Logger = loggerCore;
    await next();
    if (ctx.status === 500) {
      ctx.Logger.error(
        `${ctx.status} ${ctx.request.method} ${ctx.request.url}`
      );
    } else if (ctx.status === 200 || ctx.status === 302) {
      ctx.Logger.info(`${ctx.status} ${ctx.request.method} ${ctx.request.url}`);
    } else {
      ctx.Logger.warn(`${ctx.status} ${ctx.request.method} ${ctx.request.url}`);
    }
  };
};

export default Logger;
