const redisDB = db => {
  return async (ctx, next) => {
    ctx.DB = db
    next();
  };
};

export default redisDB;