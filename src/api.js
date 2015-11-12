import fetch from 'isomorphic-fetch';
import {apiBaseUrl} from 'config';
import merge from 'lodash/object/merge';
import qs from 'querystring';
import store from './store';

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
  const {user} = store.getState();
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

export function post(endpoint, data, params = {}, options = {}) {
  if(typeof data !== "string") {
    data = JSON.stringify(data);
    options.headers = merge({"Content-Type": "application/json"}, options.headers);
  }
  return apiCall(endpoint, params, merge({body: data, method: "POST"}, options));
}

export function get(endpoint, params = {}, options = {}) {
  return apiCall(endpoint, params, options);
}

export default {post, get};
