import _ from "lodash";
import Router from "koa-router";
import Json from "koa-json";
import { getApplicationsList, setApplicationsList } from "../dao/applications";
import {
  checkDomainDuplicates,
  changeApplicationInfoById,
  changeApplicationStatusById,
  deleteApplicationById,
} from "../service/applications";

let api = new Router();
api.use(Json());

api.get("/", async (ctx) => {
  ctx.body = "API Index";
});

api.get("/sys/user-info", async (ctx) => {
  ctx.body = {
    code: 200,
    success: true,
    username: ctx.session.username,
  };
});

api.get("/application/list", async (ctx) => {
  try {
    let data = await getApplicationsList(ctx);
    ctx.body = {
      code: 200,
      success: true,
      data,
    };
  } catch (e) {
    ctx.body = {
      code: 500,
      success: false,
      message: "Database Error",
    };
  }
});

api.post("/application/add", async (ctx) => {
  const reqObj = ctx.request.body;
  if (!reqObj.name || !reqObj.domain) {
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing",
    };
    return;
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
          message: "Duplicate domain name",
        };
        return;
      }

      let pushData = {
        id: data.applications.length + 1,
        ...reqObj,
        status: 1,
        rule_incremental_statistics: 0,
        rule_total: 0,
        rule: [],
      };

      newData.application_total = data.applications.length + 1;
      newData.application_incremental = data.application_incremental + 1;
      newData.applications.unshift(pushData);
      await setApplicationsList(ctx, newData);
      await ctx.broadcast(newData);
      ctx.body = {
        code: 200,
        success: true,
        message: "add success",
      };
    } else {
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error",
      };
    }
  } catch (E) {
    ctx.body = {
      code: 500,
      success: false,
      message: String(E),
    };
  }
});

api.post("/application/edit", async (ctx) => {
  const reqObj = ctx.request.body;
  if (!reqObj.id) {
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing",
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
      await ctx.broadcast(newData);
      ctx.body = {
        code: 200,
        success: true,
        message: "edit success",
      };
    } else {
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error",
      };
    }
  } catch (E) {
    ctx.body = {
      code: 500,
      success: false,
      message: String(E),
    };
  }
});

api.post("/application/changestatus", async (ctx) => {
  const reqObj = ctx.request.body;
  if (!reqObj.id || !(reqObj.status === 1 || reqObj.status === 0)) {
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing",
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
      await ctx.broadcast(newData);
      ctx.body = {
        code: 200,
        success: true,
        message: "changestatus success",
      };
    } else {
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error",
      };
    }
  } catch (E) {
    ctx.body = {
      code: 500,
      success: false,
      message: String(E),
    };
  }
});

api.post("/application/delete", async (ctx) => {
  const reqObj = ctx.request.body;
  if (!reqObj.id) {
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing",
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
      await ctx.broadcast(newData);
      ctx.body = {
        code: 200,
        success: true,
        message: "delete success",
      };
    } else {
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error",
      };
    }
  } catch (E) {
    ctx.body = {
      code: 500,
      success: false,
      message: String(E),
    };
  }
});

api.post("/application/:id/addrule", async (ctx) => {
  const pid = ctx.params.id;
  const reqObj = ctx.request.body;
  if (!reqObj.name || !reqObj.suffix || !reqObj.target) {
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing",
    };
    return;
  }
  try {
    let data = await getApplicationsList(ctx);
    if (data) {
      let newData = _.cloneDeep(data);
      let safeData = _.cloneDeep(data);
      const domainObj = data.applications.find((x) => x.id === Number(pid));
      if (domainObj === undefined) {
        throw "domian not found";
      }
      newData.applications = safeData.applications.map((e) => {
        if (e.id === Number(pid)) {
          const isRepeat = e.rule.find((x) => x.suffix === reqObj.suffix);
          if (isRepeat !== undefined) {
            throw "rule is repeat";
          }
          let newRuleElement = {
            id: e.rule.length + 1,
            name: reqObj.name,
            suffix: reqObj.suffix,
            status: 1,
            rewrite: true,
            rewrite_rule: "^",
            type: "Reverse Proxy",
            target: reqObj.target,
          };
          let newDomainElement = {
            ...e,
            rule_incremental_statistics: e.rule_incremental_statistics + 1,
            rule_total: e.rule_total + 1,
          };

          newDomainElement.rule.unshift(newRuleElement);
          return newDomainElement;
        } else {
          return e;
        }
      });
      await setApplicationsList(ctx, newData);
      await ctx.broadcast(newData);
      ctx.body = {
        code: 200,
        success: true,
        message: "add rule success",
      };
    } else {
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error",
      };
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      success: false,
      message: String(e),
    };
  }
});

api.post("/application/:id/deleterule", async (ctx) => {
  const pid = ctx.params.id;
  const reqObj = ctx.request.body;
  if (!reqObj.id) {
    ctx.body = {
      code: 400,
      success: false,
      message: "Field is missing",
    };
    return;
  }
  try {
    let data = await getApplicationsList(ctx);
    if (data) {
      let newData = _.cloneDeep(data);
      let safeData = _.cloneDeep(data);
      const domainObj = data.applications.find((x) => x.id === Number(pid));
      if (domainObj === undefined) {
        throw "domian not found";
      }
      newData.applications = safeData.applications.map((e) => {
        if (e.id === Number(pid)) {
          let newRule = [];
          e.rule.forEach((element) => {
            if (element.id !== reqObj.id) {
              newRule.push(element);
            }
          });
          let newApplication = {
            ...e,
            rule: newRule,
            rule_total: newRule.length,
          };
          return newApplication;
        } else {
          return e;
        }
      });
      await setApplicationsList(ctx, newData);
      await ctx.broadcast(newData);
      ctx.body = {
        code: 200,
        success: true,
        message: "/application/:id/deleterule",
      };
    } else {
      ctx.body = {
        code: 500,
        success: false,
        message: "Database error",
      };
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      success: false,
      message: String(e),
    };
  }
});

export default api;
