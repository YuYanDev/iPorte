export const getApplicationsList = ctx => {
  return new Promise((resovle, reject) => {
    ctx.DB.get("IPorte_Applications", (err, data) => {
      if (err) {
        reject(ctx.Logger.error(String(err)));
      }
      resovle(JSON.parse(data));
    });
  });
};

export const setApplicationsList = (ctx, data) => {
  return new Promise((resovle, reject) => {
    resovle(ctx.DB.set("IPorte_Applications", JSON.stringify(data)));
  });
};
