import io from "socket.io-client";
import Logger from "../../service/logger";
const Broadcast = (port = 8080) => {
  return async (ctx, next) => {
    const broadcast = (data) => {
      return new Promise((resolve) => {
        const client = io(`http://127.0.0.1:${port}`, {});
        client.on("connect", () => {
          client.emit("updateConfig", data);
          Logger.info("Start update config");
          resolve();
        });
      });
    };
    ctx.broadcast = broadcast;
    await next();
  };
};

export default Broadcast;
