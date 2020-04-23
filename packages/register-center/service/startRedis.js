import Redis from "redis";
import Logger from "./logger";

const baseDataFormat = `{"application_incremental": 0,"application_total": 0,"applications": []}`;
const startRedis = (config = { port: 6379, address: "127.0.0.1" }) => {
  let client = Redis.createClient(config.port, config.address);
  client.on("error", (err) => {
    Logger.error(err);
  });
  client.get("IPorte_Applications", function (err, reply) {
    if (reply === null || typeof reply !== "string") {
      Logger.info('The database does not exist, create a database');
      client.set("IPorte_Applications", baseDataFormat);
    } else {
      try {
        const data = JSON.parse(reply);
        if (
          data.application_incremental === undefined ||
          typeof data.application_incremental !== "number" ||
          data.application_total === undefined ||
          typeof data.application_total !== "number" ||
          data.applications === undefined ||
          Object.prototype.toString.call(data.applications) !== "[object Array]"
        ) {
          Logger.error('Database format error, rebuild the database. The original data will be overwritten');
          client.set("IPorte_Applications", baseDataFormat);
        }
      } catch (e) {
        if(String(e).match(/Unexpected end of JSON input/g)){
          Logger.error('Database format error, rebuild the database. The original data will be overwritten');
          client.set("IPorte_Applications", baseDataFormat);
        }
      }
    }
  });
  return client;
};

export default startRedis;
