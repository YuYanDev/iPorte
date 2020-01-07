"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setApplicationsList = exports.getApplicationsList = void 0;

var getApplicationsList = function getApplicationsList(ctx) {
  return new Promise(function (resovle, reject) {
    ctx.DB.get("IPorte_Applications", function (err, data) {
      if (err) {
        reject(ctx.Logger.error(String(err)));
      }

      resovle(JSON.parse(data));
    });
  });
};

exports.getApplicationsList = getApplicationsList;

var setApplicationsList = function setApplicationsList(ctx, data) {
  return new Promise(function (resovle, reject) {
    resovle(ctx.DB.set("IPorte_Applications", JSON.stringify(data)));
  });
};

exports.setApplicationsList = setApplicationsList;