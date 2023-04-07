const apiPath = '/api/v1';

const chatApiRoutes = {
  login: () => [apiPath, 'login'].join('/'),
  signup: () => [apiPath, 'signup'].join('/'),
  data: () => [apiPath, 'data'].join('/'),
};

const appRoutes = {
  chatPagePath: () => '/',
  loginPagePath: () => '/login',
  notFoundPagePath: () => '*',
  signupPagePath: () => '/signup',
};

export { chatApiRoutes, appRoutes };
