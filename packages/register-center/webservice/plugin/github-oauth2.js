import Axios from "axios";

const ClientID = "640aec9ced7002941f76";
const ClientSecret = "c3d8f5b4fbcdb0f57dccd9fcdec94836b648166b";

const redirectGithub = ctx => {
  let timeStamp = new Date().valueOf();
  ctx.redirect(
    `https://github.com/login/oauth/authorize?client_id=${ClientID}&scope=${ClientSecret}&state=${timeStamp}`
  );
};

const githubOAuth2 = async ctx => {
  const reqUrl = ctx.request.url;
  if (reqUrl.indexOf("/auth/error") !== -1) {
    return;
  } else if (reqUrl.indexOf("/auth/github_callback?code") !== -1) {
    const params = {
      client_id: ClientID,
      client_secret: ClientSecret,
      code: ctx.query.code
    };

    let res = await Axios.post(
      "https://github.com/login/oauth/access_token",
      params
    );
    if (res.data) {
      let access_token = res.data.split("&")[0].split("=")[1];
      let userData = await Axios.get(
        `https://api.github.com/user?access_token=${access_token}`
      );
      if (userData.data) {
        ctx.session.id = userData.data.id
        ctx.session.username = userData.data.name
        console.log(userData.data)
        ctx.redirect("/");
      } else {
        ctx.redirect("/auth/error");
      }
    } else {
      ctx.redirect("/auth/error");
    }
  } else {
    redirectGithub(ctx);
  }
};

export default githubOAuth2;
