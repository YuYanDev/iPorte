'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getQueryStringParams = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getQueryStringParams = exports.getQueryStringParams = function getQueryStringParams(query) {
    return query ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce(function (params, param) {
        var _param$split = param.split('='),
            _param$split2 = (0, _slicedToArray3.default)(_param$split, 2),
            key = _param$split2[0],
            value = _param$split2[1];

        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
    }, {}) : {};
};