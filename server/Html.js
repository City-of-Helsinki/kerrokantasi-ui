import React from 'react';
import PropTypes from 'prop-types';

export default class Html extends React.Component {
  render() {
    const {head, bundleSrc, content, initialState, apiBaseUrl, uiConfig, hearingData} = this.props;
    const initialStateHtml = `
    window.STATE = ${JSON.stringify(initialState || {})};
    window.API_BASE_URL = ${JSON.stringify(apiBaseUrl)};
    window.UI_CONFIG = ${JSON.stringify(uiConfig)};
    `;

    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          <meta content="width=device-width, initial-scale=1" name="viewport"/>
          {head ? head.title.toComponent() : <title>Kerrokantasi</title>}
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
  uiConfig: PropTypes.object,
  bundleSrc: PropTypes.string.isRequired,
  content: PropTypes.string,
  head: PropTypes.object,
  initialState: PropTypes.object,
  hearingData: PropTypes.object
};
