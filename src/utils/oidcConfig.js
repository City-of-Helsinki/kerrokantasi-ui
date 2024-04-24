/* eslint-disable sonarjs/no-nested-template-literals */
import config from "../config";

const port = window.location?.port || '';
const baseUrl = `${window.location.protocol}//${window.location.hostname}${port ? `:${  port}` : ''}`;

const commonOidcConfig = {
  silent_redirect_uri: `${baseUrl}/silent-renew/`,
  authority: config.openIdAuthority,
  redirect_uri: `${baseUrl}/callback`,
  post_logout_redirect_uri: `${baseUrl}/callback/logout`,
}

const apiTokenClientConfigCommon = {
  url: config.openIdApiTokenUrl,
  audiences: [config.openIdAudience],
}

const apiTokenClientConfigProfiili = {
  ...apiTokenClientConfigCommon,
  queryProps: {
    grantType: 'urn:ietf:params:oauth:grant-type:uma-ticket',
    permission: '#access',
  }
}

const resolveApiTokenClientConfig = () => {
  if (config.openIdScope === 'openid profile email') {
    return apiTokenClientConfigProfiili;
  } else {
    return apiTokenClientConfigCommon;
  }
}

const exportedApiTokenClientConfig = resolveApiTokenClientConfig();

// userManager config
export const userOidcConfig = {
  client_id: config.openIdClientId,
  scope: config.openIdScope,
  ...commonOidcConfig,
}

export const apiTokenClientConfig = exportedApiTokenClientConfig;

export default {};