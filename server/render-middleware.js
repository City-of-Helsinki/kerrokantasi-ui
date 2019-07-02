import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Html from './Html';
import fetch from 'node-fetch';

const hearingDataCache = {};
function getHearingDataCached(settings, hearingSlug, ttl = 30 * 60 * 1000) {
  const now = +new Date(); // current time as milliseconds
  if (
    hearingDataCache[hearingSlug] && // in cache
    now < hearingDataCache[hearingSlug].ts + ttl // not expired yet
  ) {
    return Promise.resolve(hearingDataCache[hearingSlug].data);
  }
  return fetch(
    `${settings.kerrokantasi_api_base}/v1/hearing/${hearingSlug}`
  )
    .then(res => (res.status === 404 ? null : res.json())) // Not found? Okay, never mind, must've been a false positive
    .catch(err => { console.error(err); }) // Other error? Meh, render w/o metatags then
    .then(data => {
      // Save in cache while we're here. (Note that 404s and errors are also cached.)
      hearingDataCache[hearingSlug] = { data, ts: now };
      return data;
    });
}

function renderHTMLSkeleton(req, res, settings) {
  const hearingSlugMatch = req.path.split('/');
  const hearingDataPromise = hearingSlugMatch
    ? getHearingDataCached(settings, hearingSlugMatch[1])
    : Promise.resolve(null);
  return hearingDataPromise.then(hearingData => {
    const html = renderToStaticMarkup(
      <Html
        bundleSrc={settings.bundleSrc || '/app.js'}
        apiBaseUrl={settings.kerrokantasi_api_base}
        heroImageURL={settings.hero_image_url}
        uiConfig={settings.ui_config}
        hearingData={hearingData}
      />
    );
    res.status(200).send(html);
  });
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
