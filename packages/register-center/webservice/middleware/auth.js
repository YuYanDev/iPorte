import githubOAuth2 from "../plugin/github-oauth2";

const Auth = () => {
  return async (ctx, next) => {
    await next();
  };
};
// const Auth = () => {
//   return async (ctx, next) => {
//     if (ctx.session && ctx.session.id) {
//       await next();
//     } else if (ctx.request.url === "/" || ctx.request.url === "/favicon.ico" || ctx.request.url.indexOf("/static")!==-1) {
//       await next();
//     } else if (ctx.request.url.indexOf("/auth") !== -1) {
//       await githubOAuth2(ctx);
//       await next();
//     } else {
//       ctx.status = 401;
//       ctx.body = {
//         success: false,
//         code: 401,
//         message: "No login authentication"
//       };
//     }
//   };
// };

export default Auth;
