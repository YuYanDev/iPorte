"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteApplicationById = exports.changeApplicationStatusById = exports.changeApplicationInfoById = exports.checkDomainDuplicates = undefined;

var _loadsh = require("loadsh");

var _loadsh2 = _interopRequireDefault(_loadsh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkDomainDuplicates = exports.checkDomainDuplicates = function checkDomainDuplicates() {
  var domainList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

  var res = domainList.find(function (x) {
    return x.domain === domain;
  });
  return res === undefined ? false : true;
};

var changeApplicationInfoById = exports.changeApplicationInfoById = function changeApplicationInfoById() {
  var originalData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var changeData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return originalData.applications.map(function (e) {
    if (e.id === changeData.id) {
      var newE = _loadsh2.default.cloneDeep(e);
      newE.name = changeData.name ? changeData.name : e.name;
      newE.domain = changeData.domain && !checkDomainDuplicates(originalData.applications, changeData.domain) ? changeData.domain : e.domain;
      return newE;
    } else {
      return e;
    }
  });
};

var changeApplicationStatusById = exports.changeApplicationStatusById = function changeApplicationStatusById() {
  var originalData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  return originalData.applications.map(function (e) {
    if (e.id === id) {
      var newE = _loadsh2.default.cloneDeep(e);
      newE.status = status;
      return newE;
    } else {
      return e;
    }
  });
};

var deleteApplicationById = exports.deleteApplicationById = function deleteApplicationById(data, id) {
  var afterApplication = [];
  data.applications.forEach(function (e) {
    if (e.id === id) {} else {
      afterApplication.push(e);
    }
  });
  return afterApplication;
};