/* eslint-disable no-param-reassign */
import urlUtil from 'url';

import qs from 'querystring-es3';
import merge from 'lodash/merge';

import fetch from './mockable-fetch';
import config from './config';

const apiAccessTokenStorage = sessionStorage;

const storageKey = 'hds_login_api_token_storage_key';

export const getApiTokenFromStorage = () => {
  const apiTokensStr = apiAccessTokenStorage.getItem(storageKey);

  if (apiTokensStr) {
    return  JSON.parse(apiTokensStr)[config.openIdAudience];
  }

  return null;
};

export const isApiTokenExpired = () => {
  const apiTokensStr = apiAccessTokenStorage.getItem(storageKey);

  if (apiTokensStr) {
    const apiTokens = JSON.parse(apiTokensStr);
    if (apiTokens[config.openIdAudience]) {
      return false;
    }
  }

  return true;
}

// FOR TESTING PURPOSES
export const storeApiTokenToStorage = (token) => {
  apiAccessTokenStorage.setItem(
    storageKey,
    JSON.stringify({[config.openIdAudience]: token})
    )
}

export function getBaseApiURL(baseUrl) {
  return (`${baseUrl.replace(/\/$/g, '')}`);
}

export function getApiURL(endpoint, params = null) {
  const baseUrl = getBaseApiURL(config.apiBaseUrl);
  let url = (`${baseUrl}/${endpoint.replace(/^\//g, '')}`);
  if (!/\/$/.test(url)) url += "/";  // All API endpoints end with a slash
  if (params) {
    if (url.indexOf("?") > -1) {
      throw new Error("Double query string");
    }
    url += `?${qs.stringify(params)}`;
  }
  return url;
}

export function apiCall(endpoint, params, options = {}) {
  const token = getApiTokenFromStorage();
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

export function jsonRequest(method, endpoint, data, params = {}, options = {}) {
  if (typeof data !== "string") {
    data = JSON.stringify(data);
    options.headers = merge(
      { "Content-Type": "application/json" },
      options.headers
    );
  }
  return apiCall(endpoint, params, merge({ body: data, method }, options));
}

export function post(endpoint, data, params = {}, options = {}) {
  return jsonRequest("POST", endpoint, data, params, options);
}

export function put(endpoint, data, params = {}, options = {}) {
  return jsonRequest("PUT", endpoint, data, params, options);
}

export function patch(endpoint, data, params = {}, options = {}) {
  return jsonRequest("PATCH", endpoint, data, params, options);
}

// eslint-disable-next-line default-param-last
export function apiDelete(endpoint, params = {}, options = { method: "DELETE" }) {
  return apiCall(endpoint, params, options);
}

export function get(endpoint, params = {}, options = {}) {
  return apiCall(endpoint, params, options);
}

export const getAllFromEndpoint = (endpoint, params = {}, options = {}) => {
  const getPaginated = (results, paramsForPage = params) =>
    get(endpoint, paramsForPage, options).then((response) => {
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
