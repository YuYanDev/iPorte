import chalk from "chalk";
import moment from "moment";

const getTime = () => {
  return moment().format("YYYY/MM/DD HH:mm:ss");
};

export default {
  info: info => {
    console.log(chalk.green(`${getTime()} [info]: ${String(info)}`));
  },
  majorinfo: info => {
    console.log(chalk.cyan(`${getTime()} [info]: ${String(info)}`));
  },
  error: info => {
    console.log(chalk.red(`${getTime()} [error]: ${String(info)}`));
  },
  warn: info => {
    console.log(chalk.yellow(`${getTime()} [warning]: ${String(info)}`));
  }
};
