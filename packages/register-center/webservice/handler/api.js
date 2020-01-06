import Router from "koa-router";
import Json from "koa-json";
import { getApplicationsList, setApplicationsList } from "../dao/applications";
import {
  checkDomainDuplicates,
  changeApplicationInfoById,
  changeApplicationStatusById,
  deleteApplicationById
} from "../service/applications";

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
    ctx.status = 400
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing"
    };
    return;
  }
  try {
    let data = await getApplicationsList(ctx);
    if (data) {
      let newData = _.cloneDeep(data);
      // Check Domain Duplicates
      if (checkDomainDuplicates(data.applications, reqObj.domain)) {
        ctx.status = 400
        ctx.body = {
          code: 400,
          success: false,
          message: "Duplicate domain name"
        };
        return;
      }

      let pushData = {
        id: data.applications.length + 1,
        ...reqObj,
        status: 1,
        rule_incremental_statistics: 0,
        rule_total: 0,
        rule: []
      };

      newData.application_total = data.applications.length + 1;
      newData.application_incremental = data.application_incremental + 1;
      newData.applications.unshift(pushData);
      await setApplicationsList(ctx, newData);
      // TODO: Add Domain Broadcast
      ctx.body = {
        code: 200,
        success: true,
        message: "add success"
      };
    } else {
      ctx.status = 500
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error"
      };
    }
  } catch (E) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      success: false,
      message: String(E)
    };
  }
});

api.post("/application/edit", async ctx => {
  const reqObj = ctx.request.body;
  if (!reqObj.id) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing"
    };
    return;
  }
  try {
    let data = await getApplicationsList(ctx);
    if (data) {
      let newData = _.cloneDeep(data);
      let newApplicationData = changeApplicationInfoById(newData, reqObj);
      newData.applications = newApplicationData;
      await setApplicationsList(ctx, newData);
      // TODO: edit Domain Broadcast
      ctx.body = {
        code: 200,
        success: true,
        message: "edit success"
      };
    } else {
      ctx.status = 500
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error"
      };
    }
  } catch (E) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      success: false,
      message: String(E)
    };
  }
});

api.post("/application/changestatus", async ctx => {
  const reqObj = ctx.request.body;
  if (!reqObj.id || !(reqObj.status === 1 || reqObj.status === 0)) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing"
    };
    return;
  }
  try {
    let data = await getApplicationsList(ctx);
    if (data) {
      let newData = _.cloneDeep(data);
      let newApplicationData = changeApplicationStatusById(
        newData,
        reqObj.id,
        reqObj.status
      );
      newData.applications = newApplicationData;
      await setApplicationsList(ctx, newData);
      // TODO: updown Domain Broadcast
      ctx.body = {
        code: 200,
        success: true,
        message: "changestatus success"
      };
    } else {
      ctx.status = 500
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error"
      };
    }
  } catch (E) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      success: false,
      message: String(E)
    };
  }
});

api.post("/application/delete", async ctx => {
  const reqObj = ctx.request.body;
  if (!reqObj.id) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing"
    };
    return;
  }
  try {
    let data = await getApplicationsList(ctx);
    if (data) {
      let newData = _.cloneDeep(data);
      let newApplicationData = deleteApplicationById(newData, reqObj.id);
      newData.applications = newApplicationData;
      newData.application_total = data.application_total - 1;
      await setApplicationsList(ctx, newData);
      // TODO: updown Domain Broadcast
      ctx.body = {
        code: 200,
        success: true,
        message: "delete success"
      };
    } else {
      ctx.status = 500
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error"
      };
    }
  } catch (E) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      success: false,
      message: String(E)
    };
  }
});

api.post("/application/:id/addrule", async ctx => {
  ctx.body = {
    code: 200,
    success: true,
    message: "/application/id/addrule"
  };
});

api.post("/application/changerulestatus", async ctx => {
  ctx.body = {
    code: 200,
    success: true,
    message: "/application/changerulestatus"
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
