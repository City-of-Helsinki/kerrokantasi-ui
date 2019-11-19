import React from 'react';
import PropTypes from 'prop-types';

export default class Html extends React.Component {
  render() {
    const {
      apiBaseUrl,
      publicUrl,
      bundleSrc,
      content,
      head,
      hearingData,
      heroImageURL,
      initialState,
      showAccessibilityInfo,
      showSocialMediaSharing,
      uiConfig,
      openIdClientId,
      openIdAudience,
      openIdAuthority,
      openIdApiTokenUrl,
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
    `;

    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta content="width=device-width, initial-scale=1" name="viewport"/>
          {hearingData && hearingData.title && <title>{hearingData.title.fi}</title>}
          {head ? head.meta.toComponent() : null}
          {head ? head.link.toComponent() : null}
          {hearingData && hearingData.main_image && <meta property="og:image" content={hearingData.main_image.url} />}
          {hearingData && hearingData.abstract && <meta property="og:description" content={hearingData.abstract.fi} />}
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: content || "" }}/>
          <script dangerouslySetInnerHTML={{ __html: initialStateHtml }}/>
          <script src={bundleSrc}/>
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
  hearingData: PropTypes.object,
  showAccessibilityInfo: PropTypes.bool,
  showSocialMediaSharing: PropTypes.bool,
  openIdClientId: PropTypes.string,
  openIdAudience: PropTypes.string,
  openIdAuthority: PropTypes.string,
  openIdApiTokenUrl: PropTypes.string,
};
