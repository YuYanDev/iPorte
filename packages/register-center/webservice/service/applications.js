import _ from "loadsh";

export const checkDomainDuplicates = (domainList = [], domain = "") => {
  let res = domainList.find(x => x.domain === domain);
  return res === undefined ? false : true;
};

export const changeApplicationInfoById = (
  originalData = {},
  changeData = {}
) => {
  return originalData.applications.map(e => {
    if (e.id === changeData.id) {
      let newE = _.cloneDeep(e);
      newE.name = changeData.name ? changeData.name : e.name;
      newE.domain =
        changeData.domain &&
        !checkDomainDuplicates(originalData.applications, changeData.domain)
          ? changeData.domain
          : e.domain;
      return newE;
    } else {
      return e;
    }
  });
};

export const changeApplicationStatusById = (
  originalData = {},
  id = null,
  status = 0
) => {
  return originalData.applications.map(e => {
    if (e.id === id) {
      let newE = _.cloneDeep(e);
      newE.status = status;
      return newE;
    } else {
      return e;
    }
  });
};

export const deleteApplicationById = (data, id) => {
  let afterApplication = [];
  data.applications.forEach(e => {
    if (e.id === id) {
    } else {
      afterApplication.push(e);
    }
  });
  return afterApplication;
};
