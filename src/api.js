import fetch from 'isomorphic-fetch';
import {apiBaseUrl} from './config';
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

export function apiCall(state, endpoint, params, options = {}) {
  if (typeof state !== "object") {
    throw new Error("API calls require redux state for authentication");
  }
  const {user} = state;
  const finalOptions = merge({method: "GET"}, options);
  const defaultHeaders = {
    "Accept": "application/json"
  };
  if (user && user.token) {
    defaultHeaders.Authorization = "JWT " + user.token;
  }
  finalOptions.headers = merge(defaultHeaders, finalOptions.headers || {});
  const url = getApiURL(endpoint, params);
  return fetch(url, finalOptions);
}

export function post(state, endpoint, data, params = {}, options = {}) {
  if (typeof data !== "string") {
    data = JSON.stringify(data);  // eslint-disable-line no-param-reassign
    options.headers = merge({"Content-Type": "application/json"}, options.headers);
  }
  return apiCall(state, endpoint, params, merge({body: data, method: "POST"}, options));
}

export function get(state, endpoint, params = {}, options = {}) {
  return apiCall(state, endpoint, params, options);
}

export default {post, get};
