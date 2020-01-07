"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setApplicationsList = exports.getApplicationsList = void 0;

var getApplicationsList = ctx => {
  return new Promise((resovle, reject) => {
    ctx.DB.get("IPorte_Applications", (err, data) => {
      if (err) {
        reject(ctx.Logger.error(String(err)));
      }

      resovle(JSON.parse(data));
    });
  });
};

exports.getApplicationsList = getApplicationsList;

var setApplicationsList = (ctx, data) => {
  return new Promise((resovle, reject) => {
    resovle(ctx.DB.set("IPorte_Applications", JSON.stringify(data)));
  });
};

exports.setApplicationsList = setApplicationsList;