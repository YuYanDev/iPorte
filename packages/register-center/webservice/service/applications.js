export const queryApplicationsList = ctx => {
  return new Promise((resovle, reject) => {
    ctx.DB.lrange("IPorte_Applications", 0, -1, (err, data) => {
      if (err) {
        reject(ctx.Logger.error(String(err)));
      }
      resovle(data.map(e => JSON.parse(e)));
    });
  });
};

export const queryApplicationsIncrementalStatistics = ctx => {
  return new Promise((resovle, reject) => {
    ctx.DB.get("IPorte_ApplicationsHistoryCount", (err, data) => {
      if (err) {
        reject(ctx.Logger.error(String(err)));
      }
      resovle(Number(data));
    });
  });
};

export const addApplications = (ctx, data) => {
  return new Promise((resovle, reject) => {
    resovle(
      ctx.DB.lpush("IPorte_Applications", JSON.stringify(data), ctx.DB.print)
    );
  });
};

export const addApplicationsIncrementalStatistics = ctx => {
  return new Promise((resovle, reject) => {
    ctx.DB.get("IPorte_ApplicationsHistoryCount", (err, data) => {
      if (err) {
        reject(ctx.Logger.error(String(err)));
      }
      resovle(ctx.DB.set("IPorte_ApplicationsHistoryCount", Number(data) + 1));
    });
  });
};
