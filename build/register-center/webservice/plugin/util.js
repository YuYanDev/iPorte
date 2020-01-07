"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryStringParams = void 0;

var getQueryStringParams = query => {
  return query ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
    var [key, value] = param.split('=');
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
    return params;
  }, {}) : {};
};

exports.getQueryStringParams = getQueryStringParams;