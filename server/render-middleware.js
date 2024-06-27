/* eslint-disable no-console */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Html from './Html';

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
        publicUrl={settings.public_url}
        apiBaseUrl={settings.kerrokantasi_api_base}
        heroImageURL={settings.hero_image_url}
        uiConfig={settings.ui_config}
        hearingData={hearingData}
        showAccessibilityInfo={settings.show_accessibility_info}
        showSocialMediaSharing={settings.show_social_media_sharing}
        enableCookies={settings.enable_cookies}
        matomoCookieDomain={settings.matomo_cookie_domain}
        matomoDomains={settings.matomo_domains}
        matomoSiteId={settings.matomo_site_id}
        matomoScriptUrl={settings.matomo_script_url}
        matomoScriptFilename={settings.matomo_script_filename}
        enableCookiebot={settings.enable_cookiebot}
        cookiebotDataCbid={settings.cookiebot_data_cbid}
        openIdClientId={settings.openid_client_id}
        openIdAudience={settings.openid_audience}
        openIdAuthority={settings.openid_authority}
        openIdApiTokenUrl={settings.openid_apitoken_url}
        openIdScope={settings.openid_scope}
        enableHighContrast={settings.enable_highcontrast}
        enableStrongAuth={settings.enable_strong_auth}
        adminHelpUrl={settings.admin_help_url}
        emptyCommentString={settings.empty_comment_string}
        maintenanceShowNotification={settings.maintenance_show_notification}
        maintenanceDisableLogin={settings.maintenance_disable_login}
        maintenanceDisableComments={settings.maintenance_disable_comments}
      />
    );
    res.status(200).send(html);
  });
}

export default function renderMiddleware(settings) {
  return (req, res, next) => {
    const { accept } = req.headers;
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
    return renderHTMLSkeleton(req, res, settings);
  };
}
