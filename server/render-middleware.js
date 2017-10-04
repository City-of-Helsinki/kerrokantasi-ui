import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Html from './Html';


function renderHTMLSkeleton(req, res, settings) {
  const html = renderToStaticMarkup(
    <Html
      bundleSrc={settings.bundleSrc || '/app.js'}
      apiBaseUrl={settings.apiBaseUrl}
      uiConfig={settings.uiConfig}
    />
  );
  res.status(200).send(html);
}

export default function renderMiddleware(settings) {
  return (req, res, next) => {
    const {accept} = req.headers;
    if (req.method !== 'GET') {
      return next();
    }
    if (typeof accept !== 'string') {
      return next();
    }
    if (
      accept.indexOf('application/json') === 0 ||
      (
        accept.indexOf('text/html') === -1 &&
        accept.indexOf('*/*') === -1
      )
    ) {
      return next();
    }
    if (req.url.indexOf(".") > -1) {
      return next();
    }
    return renderHTMLSkeleton(req, res, settings);
  };
}
