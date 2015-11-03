import fetch from 'isomorphic-fetch';
import {apiBaseUrl} from 'config';
import merge from 'lodash/object/merge';
import qs from 'querystring';

function getApiURL(endpoint, params = null) {
  let url = (apiBaseUrl.replace(/\/$/g, '') + "/" + endpoint.replace(/^\//g, ''));
  if (!/\/$/.test(url)) url += "/";  // All API endpoints end with a slash
  if (params) {
    if (url.indexOf("?") > -1) {
      throw new Error("Double query string");
    }
    url += "?" + qs.stringify(params);
  }
  return url;
}

export function apiCall(endpoint, params, options = {}) {
  const finalOptions = merge({
    method: "GET",
    credentials: "include"
  }, options);
  finalOptions.headers = merge(
    {"Accept": "application/json"},
    finalOptions.headers || {}
  );
  const url = getApiURL(endpoint, params);
  return fetch(url, finalOptions);
}

export function post(endpoint, data, params = {}, options = {}) {
  return apiCall(endpoint, params, merge({data, method: "POST"}, options));
}

export function get(endpoint, params = {}, options = {}) {
  return apiCall(endpoint, params, options);
}

export default {post, get};
