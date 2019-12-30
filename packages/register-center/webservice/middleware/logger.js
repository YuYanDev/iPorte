import loggerCore from '../../service/logger'

const Logger = () => {
  return async (ctx, next) => {
    ctx.Logger = loggerCore
    await next();
  };
};

export default Logger;
