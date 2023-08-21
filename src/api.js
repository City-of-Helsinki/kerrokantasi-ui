import fetch from './mockable-fetch';
import config from './config';
import merge from 'lodash/merge';
import qs from 'querystring-es3';
import urlUtil from 'url';

import merge from 'lodash/merge';

import fetch from './mockable-fetch';
import config from './config';
import { getApiToken } from './selectors/user';

export function getApiURL(endpoint, params = null) {
  let url = (`${config.apiBaseUrl.replace(/\/$/g, '')}/${endpoint.replace(/^\//g, '')}`);
  if (!/\/$/.test(url)) url += "/";  // All API endpoints end with a slash
  if (params) {
    if (url.indexOf("?") > -1) {
      throw new Error("Double query string");
    }
    url += `?${qs.stringify(params)}`;
  }
  return url;
}

export function apiCall(state, endpoint, params, options = {}) {
  if (typeof state !== "object") {
    throw new Error("API calls require redux state for authentication");
  }
  const token = getApiToken(state);
  options = merge({ method: "GET", credentials: "include" }, options);
  const defaultHeaders = {
    "Accept": "application/json"  // eslint-disable-line quote-props
  };
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  options.headers = merge(defaultHeaders, options.headers || {});

  const url = getApiURL(endpoint, params);
  return fetch(url, options);
}

export function jsonRequest(method, state, endpoint, data, params = {}, options = {}) {
  if (typeof data !== "string") {
    data = JSON.stringify(data);
    options.headers = merge(
      { "Content-Type": "application/json" },
      options.headers
    );
  }
  return apiCall(state, endpoint, params, merge({ body: data, method }, options));
}

export function post(state, endpoint, data, params = {}, options = {}) {
  return jsonRequest("POST", state, endpoint, data, params, options);
}

export function put(state, endpoint, data, params = {}, options = {}) {
  return jsonRequest("PUT", state, endpoint, data, params, options);
}

export function patch(state, endpoint, data, params = {}, options = {}) {
  return jsonRequest("PATCH", state, endpoint, data, params, options);
}

// eslint-disable-next-line default-param-last
export function apiDelete(state = {}, endpoint, params = {}, options = { method: "DELETE" }) {
  return apiCall(state, endpoint, params, options);
}

export function get(state, endpoint, params = {}, options = {}) {
  return apiCall(state, endpoint, params, options);
}

export const getAllFromEndpoint = (state, endpoint, params = {}, options = {}) => {
  const getPaginated = (results, paramsForPage = params) =>
    get(state, endpoint, paramsForPage, options).then((response) => {
      const responseOk = response.status >= 200 && response.status < 300;
      const data = response.json();
      if (!responseOk) {
        return data.then(err => {
          throw new Error({
            ...err,
            status: response.status,
          });
        });
      }
      return data;
    }).then((data) => {
      const updatedResults = [...results, ...data.results];
      if (data.next) {
        const nextParams = urlUtil.parse(data.next, true).query;
        return getPaginated(updatedResults, { ...paramsForPage, ...nextParams });
      }

      return updatedResults;
    });

  return getPaginated([], params);
};

export default { post, put, patch, apiDelete, get, getAllFromEndpoint };
