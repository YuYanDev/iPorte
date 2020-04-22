import ajax from "../lib/ajax";

export const getApplicationList = (params) =>
  ajax.request({
    url: "/api/application/list",
    params,
    method: "get",
  });

export const addApplication = (data) =>
  ajax.request({
    url: "/api/application/add",
    data,
    method: "post",
  });

export const changeApplicationStatusById = (data) =>
  ajax.request({
    url: "/api/application/changestatus",
    data,
    method: "post",
  });

export const deleteApplicationById = (data) =>
  ajax.request({
    url: "/api/application/delete",
    data,
    method: "post",
  });

export const addApplicationRuleById = (data, id = "") =>
  ajax.request({
    url: `/api/application/${id}/addrule`,
    data,
    method: "post",
  });

  export const deleteApplicationRuleById = (data, id = "") =>
  ajax.request({
    url: `/api/application/${id}/deleterule`,
    data,
    method: "post",
  });