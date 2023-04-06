const apiPath = '/api/v1';

export default {
  chatApiRoutes: {
    login: () => [apiPath, 'login'].join('/'),
    signup: () => [apiPath, 'signup'].join('/'),
    data: () => [apiPath, 'data'].join('/'),
  },
  appRoutes: {
    chatPagePath: () => '/',
    loginPagePath: () => '/login',
    notFoundPagePath: () => '*',
    signupPagePath: () => '/signup',
  },
};
