import chalk from "chalk";
import moment from "moment";

const getTime = () => {
  return moment().format("YYYY/MM/DD HH:mm:ss");
};

export default {
  info: info => {
    console.log(`${getTime()} [info]: ${chalk.green(info)}`);
  },
  error: info => {
    console.log(`${getTime()} [info]: ${chalk.red(info)}`);
  },
  warn: info => {
    console.log(`${getTime()} [info]: ${chalk.yellow(info)}`);
  }
};
