import ajax from "../lib/ajax";

export const getApplicationList = params =>
  ajax.request({
    url: "/api/application/list",
    params,
    method: "get"
  });

export const deleteApplicationById = data =>
  ajax.request({
    url: "/api/application/delete",
    data,
    method: "post"
  });
