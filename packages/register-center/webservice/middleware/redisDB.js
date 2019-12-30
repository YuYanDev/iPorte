const redisDB = db => {
  return async (ctx, next) => {
    ctx.DB = db
    await next();
  };
};

export default redisDB;