/**
 * findRuleTargetByUrl
 * 
 * Find the best matching rules through routing and routing tables
 * 
 * @param {Array} ruleList 
 * @param {String} url 
 */
export const findRuleTargetByUrl = (ruleList, url) => {
  let missQueryUrl = url.split("?")[0];
  let missLastSlashUrl =
    url.length === 1
      ? url
      : "/" ===
        missQueryUrl.substring(missQueryUrl.length - 1, missQueryUrl.length)
      ? missQueryUrl.substring(0, missQueryUrl.length - 1)
      : missQueryUrl;
  const cleanUrl = missLastSlashUrl;
  let list = [];
  ruleList.forEach(r => {
    cleanUrl.indexOf(r.suffix) !== -1 ? list.push(r) : "";
  });

  if (list.length === 0){
      return undefined
  }
  
  if (list.length === 1) {
    return list[0];
  }

  let maxLength = 0;
  let maxLengthIndex = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].suffix.length > maxLength) {
      maxLength = list[i].suffix.length;
      maxLengthIndex = i;
    }
  }
  return list[maxLengthIndex]
};
