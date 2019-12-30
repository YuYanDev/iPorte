import Redis from "redis";
import Logger from "./logger";

const startRedis = (config = { port: 6379, address: "127.0.0.1" }) => {
  let client = Redis.createClient(config.port, config.address);
  client.on("error", err => {
    Logger.error(err);
  });
  return client;
};

export default startRedis;
