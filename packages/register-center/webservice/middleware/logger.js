import loggerCore from '../../service/logger'

const Logger = () => {
  return async (ctx, next) => {
    ctx.Logger = loggerCore
    next();
  };
};

export default Logger;
