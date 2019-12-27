import githubOAuth2 from '../plugin/github-oauth2'

const OAuth2 = () => {
  return async (ctx, next) => {
    // console.log(ctx.session)
    if(ctx.session && ctx.session.id){
      next()
    } else {
      await githubOAuth2(ctx)
      await next();
    }
  };
};

export default OAuth2;
