import Router from "koa-router";
import Json from "koa-json";
import _ from "loadsh";
import {
  getApplicationsList,
  setApplicationsList
} from "../service/applications";

const checkDomainDuplicates = (domainList = [], domain = "") => {
  let res = domainList.find(x => x.domain === domain);
  return res === undefined ? false : true;
};

let api = new Router();
api.use(Json());

api.get("/", async ctx => {
  ctx.body = "API Index";
});

api.get("/sys/user-info", async ctx => {
  ctx.body = {
    code: 200,
    success: true,
    username: ctx.session.username
  };
});

api.get("/application/list", async ctx => {
  let data = await getApplicationsList(ctx);
  ctx.body = {
    code: 200,
    success: true,
    data
  };
});

api.post("/application/add", async ctx => {
  const reqObj = ctx.request.body;
  if (!reqObj.name || !reqObj.domain) {
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing"
    };
  }
  try {
    let data = await getApplicationsList(ctx);
    if (data) {
      let newData = _.cloneDeep(data);
      // Check Domain Duplicates
      if (checkDomainDuplicates(data.applications, reqObj.domain)) {
        ctx.body = {
          code: 400,
          success: false,
          message: "Duplicate domain name"
        };
        return;
      }

      let pushData = {
        id: data.applications.length + 1,
        status: 1,
        rule_incremental_statistics: 0,
        rule_total: 0,
        rule: [],
        ...ctx.request.body
      };

      newData.application_total = data.applications.length + 1;
      newData.application_incremental = data.application_incremental + 1;
      newData.applications.push(pushData);
      await setApplicationsList(ctx, newData);
      // TODO: Add Domain Broadcast
      ctx.body = {
        code: 200,
        success: true,
        message: newData
      };
    } else {
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error"
      };
    }
  } catch (E) {
    ctx.body = {
      code: 500,
      success: false,
      message: String(E)
    };
  }
});

api.post("/application/edit", async ctx => {
  ctx.body = {
    code: 200,
    success: true,
    message: "/application/edit"
  };
});

api.post("/application/delete", async ctx => {
  ctx.body = {
    code: 200,
    success: true,
    message: "/application/delete"
  };
});

api.post("/application/:id/addrule", async ctx => {
  ctx.body = {
    code: 200,
    success: true,
    message: "/application/id/addrule"
  };
});

api.post("/application/:id/editrule", async ctx => {
  ctx.body = {
    code: 200,
    success: true,
    message: "/application/id/editrule"
  };
});

api.post("/application/:id/deleterule", async ctx => {
  ctx.body = {
    code: 200,
    success: true,
    message: "/application/:id/deleterule"
  };
});

export default api;
