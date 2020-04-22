import io from "socket.io-client";
import Logger from "../../service/logger";
const Broadcast = () => {
  return async (ctx, next) => {
    const broadcast = (data) => {
      return new Promise((resolve) => {
        const client = io("http://localhost:8080", {});
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
