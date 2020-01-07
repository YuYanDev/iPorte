"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteApplicationById = exports.changeApplicationStatusById = exports.changeApplicationInfoById = exports.checkDomainDuplicates = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var checkDomainDuplicates = function checkDomainDuplicates() {
  var domainList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var res = domainList.find(x => x.domain === domain);
  return res === undefined ? false : true;
};

exports.checkDomainDuplicates = checkDomainDuplicates;

var changeApplicationInfoById = function changeApplicationInfoById() {
  var originalData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var changeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return originalData.applications.map(e => {
    if (e.id === changeData.id) {
      var newE = _lodash.default.cloneDeep(e);

      newE.name = changeData.name ? changeData.name : e.name;
      newE.domain = changeData.domain && !checkDomainDuplicates(originalData.applications, changeData.domain) ? changeData.domain : e.domain;
      return newE;
    } else {
      return e;
    }
  });
};

exports.changeApplicationInfoById = changeApplicationInfoById;

var changeApplicationStatusById = function changeApplicationStatusById() {
  var originalData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return originalData.applications.map(e => {
    if (e.id === id) {
      var newE = _lodash.default.cloneDeep(e);

      newE.status = status;
      return newE;
    } else {
      return e;
    }
  });
};

exports.changeApplicationStatusById = changeApplicationStatusById;

var deleteApplicationById = (data, id) => {
  var afterApplication = [];
  data.applications.forEach(e => {
    if (e.id === id) {} else {
      afterApplication.push(e);
    }
  });
  return afterApplication;
};

exports.deleteApplicationById = deleteApplicationById;