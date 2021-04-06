import { createUserManager } from "redux-oidc";
import config from "../config";

const baseUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

const userManagerConfig = {
  client_id: config.openIdClientId,
  redirect_uri: `${baseUrl}/callback`,
  response_type: 'id_token token',
  scope: `openid profile ${config.openIdAudience}`,
  authority: config.openIdAuthority,
  post_logout_redirect_uri: `${baseUrl}/callback/logout`,
  silent_redirect_uri: `${baseUrl}/silent-renew/`,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true,
};

const userManager = createUserManager(userManagerConfig);

export default userManager;
