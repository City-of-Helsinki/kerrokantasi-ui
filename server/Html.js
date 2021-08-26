import React from 'react';
import PropTypes from 'prop-types';

export default class Html extends React.Component {
  getMeta() {
    const {heroImageURL, hearingData} = this.props;
    const hearingImage = hearingData && hearingData.main_image;
    const hearingAbstract = hearingData && hearingData.abstract;
    return {
      title: 'Kerrokantasi',
      url: hearingImage ? hearingData.main_image.url : heroImageURL,
      description: hearingAbstract ?
        hearingData.abstract.fi :
        `Turun kaupungin Kerrokantasi-palvelussa kaupunkilaisilta 
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
      hearingData,
      heroImageURL,
      initialState,
      showAccessibilityInfo,
      showSocialMediaSharing,
      enableCookies,
      uiConfig,
      openIdClientId,
      openIdAudience,
      openIdAuthority,
      openIdApiTokenUrl,
      enableHighContrast,
      adminHelpUrl,
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
    window.ADMIN_HELP_URL = ${JSON.stringify(adminHelpUrl)};
    `;
    const {title, description, url} = this.getMeta();
    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta content="width=device-width, initial-scale=1" name="viewport"/>
          {hearingData && hearingData.title && <title>{hearingData.title.fi}</title>}
          {head ? head.meta.toComponent() : null}
          {head ? head.link.toComponent() : null}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={url} />
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
  enableCookies: PropTypes.bool,
  openIdClientId: PropTypes.string,
  openIdAudience: PropTypes.string,
  openIdAuthority: PropTypes.string,
  openIdApiTokenUrl: PropTypes.string,
  enableHighContrast: PropTypes.bool,
  adminHelpUrl: PropTypes.string,
};
