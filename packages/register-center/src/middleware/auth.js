import githubOAuth2 from '../plugin/github-oauth2'

const Auth = () => {
  return async (ctx, next) => {
    if(ctx.session && ctx.session.id){
      next()
    } else {
      await githubOAuth2(ctx)
      await next();
    }
  };
};

export default Auth;
