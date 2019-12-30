import fs from "fs";
import concat from "concat-stream";
import toml from "toml";

const loadConfigObjFromToml = filePath => {
  return new Promise(resolve => {
    fs.createReadStream(filePath, "utf8").pipe(
      concat(data => {
        resolve(toml.parse(data));
      })
    );
  });
};

export default loadConfigObjFromToml;
