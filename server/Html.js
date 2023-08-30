/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

export default class Html extends React.Component {
  // Fetches site's default metadata, these are often overwritten
  // with more specific values
  getDefaultMeta() {
    const { heroImageURL } = this.props;
    return {
      title: 'Kerrokantasi',
      url: heroImageURL,
      description: `Kaupungin Kerrokantasi-palvelussa kaupunkilaisilta 
      kerätään mielipiteitä valmistelussa olevista asioista.`
    };
  }
  render() {
    const {
      apiBaseUrl,
      publicUrl,
      bundleSrc,
      content,
      head,
      heroImageURL,
      initialState,
      showAccessibilityInfo,
      showSocialMediaSharing,
      enableCookies,
      matomoCookieDomain,
      matomoDomains,
      matomoSiteId,
      matomoScriptFilename,
      matomoScriptUrl,
      enableCookiebot,
      cookiebotDataCbid,
      uiConfig,
      openIdClientId,
      openIdAudience,
      openIdAuthority,
      openIdApiTokenUrl,
      enableHighContrast,
      enableStrongAuth,
      adminHelpUrl,
      emptyCommentString,
      maintenanceShowNotification,
    } = this.props;
    const initialStateHtml = `
    window.STATE = ${JSON.stringify(initialState || {})};
    window.API_BASE_URL = ${JSON.stringify(apiBaseUrl)};
    window.PUBLIC_URL = ${JSON.stringify(publicUrl)};
    window.HERO_IMAGE_URL = ${JSON.stringify(heroImageURL)};
    window.UI_CONFIG = ${JSON.stringify(uiConfig)};
    window.SHOW_ACCESSIBILITY_INFO = ${JSON.stringify(showAccessibilityInfo)};
    window.OPENID_CLIENT_ID = ${JSON.stringify(openIdClientId)};
    window.OPENID_AUDIENCE = ${JSON.stringify(openIdAudience)};
    window.OPENID_AUTHORITY = ${JSON.stringify(openIdAuthority)};
    window.OPENID_APITOKEN_URL = ${JSON.stringify(openIdApiTokenUrl)};
    window.SHOW_SOCIAL_MEDIA_SHARING = ${JSON.stringify(showSocialMediaSharing)};
    window.ENABLE_HIGHCONTRAST = ${JSON.stringify(enableHighContrast)}
    window.ENABLE_COOKIES = ${JSON.stringify(enableCookies)};
    window.MATOMO_COOKIE_DOMAIN = ${JSON.stringify(matomoCookieDomain)};
    window.MATOMO_DOMAINS = ${JSON.stringify(matomoDomains)};
    window.MATOMO_SITE_ID = ${JSON.stringify(matomoSiteId)};
    window.MATOMO_SCRIPT_URL = ${JSON.stringify(matomoScriptUrl)};
    window.MATOMO_SCRIPT_FILENAME = ${JSON.stringify(matomoScriptFilename)};
    window.ENABLE_COOKIEBOT = ${JSON.stringify(enableCookiebot)};
    window.COOKIEBOT_DATA_CBID = ${JSON.stringify(cookiebotDataCbid)};
    window.ENABLE_STRONG_AUTH = ${JSON.stringify(enableStrongAuth)}
    window.ADMIN_HELP_URL = ${JSON.stringify(adminHelpUrl)};
    window.EMPTY_COMMENT_STRING = ${JSON.stringify(emptyCommentString)};
    window.MAINTENANCE_SHOW_NOTIFICATION = ${JSON.stringify(maintenanceShowNotification)};
    `;
    const { title, description, url } = this.getDefaultMeta();
    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          {head ? head.meta.toComponent() : null}
          {head ? head.link.toComponent() : null}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={url} />
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: content || "" }} />
          <script dangerouslySetInnerHTML={{ __html: initialStateHtml }} />
          <script src={bundleSrc} />
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  apiBaseUrl: PropTypes.string,
  publicUrl: PropTypes.string,
  heroImageURL: PropTypes.string,
  uiConfig: PropTypes.object,
  bundleSrc: PropTypes.string.isRequired,
  content: PropTypes.string,
  head: PropTypes.object,
  initialState: PropTypes.object,
  showAccessibilityInfo: PropTypes.bool,
  showSocialMediaSharing: PropTypes.bool,
  enableCookies: PropTypes.bool,
  matomoCookieDomain: PropTypes.string,
  matomoDomains: PropTypes.array,
  matomoSiteId: PropTypes.number,
  matomoScriptFilename: PropTypes.string,
  matomoScriptUrl: PropTypes.string,
  enableCookiebot: PropTypes.bool,
  cookiebotDataCbid: PropTypes.string,
  openIdClientId: PropTypes.string,
  openIdAudience: PropTypes.string,
  openIdAuthority: PropTypes.string,
  openIdApiTokenUrl: PropTypes.string,
  enableHighContrast: PropTypes.bool,
  enableStrongAuth: PropTypes.bool,
  adminHelpUrl: PropTypes.string,
  emptyCommentString: PropTypes.string,
  maintenanceShowNotification: PropTypes.bool,
};
