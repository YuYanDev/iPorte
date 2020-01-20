"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRuleTargetByUrl = void 0;

/**
 * findRuleTargetByUrl
 * 
 * Find the best matching rules through routing and routing tables
 * 
 * @param {Array} ruleList 
 * @param {String} url 
 */
var findRuleTargetByUrl = function findRuleTargetByUrl(ruleList, url) {
  var missQueryUrl = url.split("?")[0];
  var missLastSlashUrl = url.length === 1 ? url : "/" === missQueryUrl.substring(missQueryUrl.length - 1, missQueryUrl.length) ? missQueryUrl.substring(0, missQueryUrl.length - 1) : missQueryUrl;
  var cleanUrl = missLastSlashUrl;
  var list = [];
  ruleList.forEach(function (r) {
    cleanUrl.indexOf(r.suffix) !== -1 ? list.push(r) : "";
  });

  if (list.length === 0) {
    return undefined;
  }

  if (list.length === 1) {
    return list[0];
  }

  var maxLength = 0;
  var maxLengthIndex = 0;

  for (var i = 0; i < list.length; i++) {
    if (list[i].suffix.length > maxLength) {
      maxLength = list[i].suffix.length;
      maxLengthIndex = i;
    }
  }

  return list[maxLengthIndex];
};

exports.findRuleTargetByUrl = findRuleTargetByUrl;