import fs from "fs";
import toml from "toml";
import { defaultConfig } from '../constants/index' 
import Logger from './logger'

const loadConfigObjFromToml = filePath => {
  return new Promise(resolve => {
    fs.readFile(filePath, function(err, data) {
      if (err) {
        Logger.error(err);
        Logger.warn("can't load config file. load default config");
        resolve(defaultConfig);
        return;
      }
      resolve(toml.parse(data.toString()));
    });
  });
};

export default loadConfigObjFromToml;
