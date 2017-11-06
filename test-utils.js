import assign from 'lodash/assign';
import noop from 'lodash/noop';
import commonInit from './src/commonInit';
import createStore from './src/createStore';
import messages from './src/i18n';
import React from 'react';
import express from 'express';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import Response from 'node-fetch/lib/response';
import {Readable} from 'stream';

export const mockUser = {id: "fff", displayName: "Mock von User"};

/**
 * Wire a component class up with Redux and React-Intl for testing.
 * Because there doesn't seem to be a good way to pass context down, the returned
 * element is not directly the type passed in.
 *
 * @param store Store (or initial state object implicitly converted to a store)
 * @param type Element type
 * @param props Element props
 * @param children Element children
 */
export function wireComponent(store, type, props = {}, children = []) {
  if (typeof store.getState !== "function") {  // Doesn't quack like a store
    store = createTestStore(store);  // eslint-disable-line no-param-reassign
  }
  const locale = store.getState().language || "fi";
  const el = React.createElement(type, props, children);
  const intlProvider = React.createElement(IntlProvider, {locale, messages: messages[locale] || {}}, el);
  const reduxProvider = React.createElement(Provider, {store}, intlProvider);
  return reduxProvider;
}

export function createTestStore(state) {
  commonInit();
  return createStore(state || {});
}

/**
 * Constructor for a mock response object; the `writer`
 * property is just about enough to pass to our Express renderers.
 * @param done {Function} Called when the request is finished (when `send` is called).
 * @constructor
 */
function MockResponse(done = noop) {
  const res = this;
  let _status = null;
  let _body = "";
  const writer = this.writer = {
    status: (code) => {
      _status = code;
      return writer;
    },
    json: (json) => {
      return writer.send(JSON.stringify(json));
    },
    send: (data) => {
      _body += data;
      done(res);
    }
  };
  res.dump = () => {
    return {status: _status, body: _body};
  };
}

/**
 * Get a promise for rendering a given request's response.
 * Server rendering is forced true for these requests.
 *
 * @param request Express-like request object. Just setting `url` should be enough.
 * @param settings Settings object.
 * @param initialState Initial state.
 * @return {Promise}
 */
export function getRenderPromise(request, initialState = {}, settings = {}) {
  const render = require('./server/render');
  const finalSettings = assign({}, settings, {serverRendering: true, dev: true});
  const finalRequest = assign(Object.create(express.request), assign({method: "GET"}, request));
  return new Promise((resolve) => {
    const mockResponse = new MockResponse((res) => {
      resolve(res.dump());
    });
    render(finalRequest, mockResponse.writer, finalSettings, initialState);
  });
}

/**
 * Meta-function for easily testing both logged-in and logged-out states.
 *
 * The given `fn` is called with an object with {state, message} keys;
 * `state` is an initial state object and `message` something to append to
 * the test description.
 *
 * @param state State to merge in.
 * @param fn Test-declaring (`it...`) function.
 */
export function withAndWithoutUser(state = null, fn = null) {
  if (typeof state === 'function') {
    fn = state;  // eslint-disable-line no-param-reassign
    state = {};  // eslint-disable-line no-param-reassign
  }
  [
    {state: assign({}, state, {user: {data: null, isFetching: false}}), message: "when not logged in"},
    {state: assign({}, state, {user: {data: mockUser, isFecting: false}}), message: "when logged in"}
  ].forEach(fn);
}

function streamify(obj) {
  if (typeof obj === "string") {
    const rs = new Readable;
    rs.push("" + obj);
    rs.push(null);
    return rs;
  }
  return obj;
}

/**
 * Return a mock fetch() replacement function for the given URL map.
 *
 * The URL map handlers are functions (or just straight data).
 * Functions have the signature (url, options) (exactly those given to fetch()).
 * The data, or the functions' retvals, should be Response objects (see
 * `jsonResponse`), strings (assumed typeless OK responses), or objects with {body, init},
 * that are then used to instantiate Responses.
 *
 * In addition, the returned function will have a `.calls` dictionary, recording the times
 * each endpoint was called.
 *
 * @param urlMap URL map dictionary.
 * @return {fetcher} A fetcher function.
 */
export function mockFetch(urlMap) {
  const calls = {};
  const fetcher = (url, options) => {
    calls[url] = (calls[url] || 0) + 1;
    const handler = urlMap[url] || urlMap[url.split("?")[0]];
    if (!handler) {
      throw new Error("Unexpected fetch for URL " + url + " (options " + options + ")");
    }
    let rv = null;
    if (typeof handler === 'function') {
      rv = handler(url, options);
    } else {
      rv = handler; // Assumed straight data.
    }
    if (rv.then) { // Smells like a promise -- fine!
      return rv;
    }
    if (typeof rv === "string") {
      rv = {body: rv, init: {status: 200}};
    }
    if (rv.body && rv.init) {
      rv = new Response(streamify(rv.body), rv.init);
    }
    if (!(rv.json && typeof rv.json === 'function')) {
      throw new Error("The return value from mockFetch handler for " + url + " did not return a response");
    }
    return new Promise((resolve) => {
      resolve(rv);
    });
  };
  fetcher.calls = calls;
  return fetcher;
}

export function jsonResponse(content, status = 200) {
  return new Response(
    streamify(JSON.stringify(content)),
    {
      status,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

export const getIntlAsProp = () => {
  const intlProvider = new IntlProvider({ locale: 'fi', messages: messages.fi}, {});
  return intlProvider.getChildContext().intl;
}

// Contains ready to use mock data & functions for testing purposes
export const mockStore = {
  hearing: {
    mockHearing: {
      state: 'done',
      data: {
        abstract: {
          fi: 'Tämä on suomenkielinen testiabstrakti. Sisältää huikean kuvauksen kyseisestä kuulemisesta.'
        },
        id: 'rXT2L1HxEOZTERjluyxyQZ412aYM8oZE',
        n_comments: 1,
        published: true,
        labels: [],
        open_at: '2017-10-22T21:00:00Z',
        close_at: '2017-11-28T22:00:00Z',
        created_at: '2017-10-23T11:07:26.630423Z',
        servicemap_url: '',
        sections: [
          {
            id: '7CxRxrlvrW9uCCjEaB9rW1dENHQMudeK',
            type: 'main',
            commenting: 'open',
            voting: 'registered',
            published: false,
            created_at: '2017-10-23T11:07:26.668934Z',
            images: [
              {
                id: 92,
                url: 'https://api.hel.fi/kerrokantasi-test/media/images/2017/10/LzqVMrMI.jpeg',
                width: 893,
                height: 631,
                title: {},
                caption: {
                  fi: 'A Wonderfull caption'
                }
              }
            ],
            n_comments: 1,
            type_name_singular: 'pääosio',
            type_name_plural: 'pääosiot',
            plugin_identifier: '',
            plugin_data: '',
            plugin_iframe_url: '',
            plugin_fullscreen: false,
            title: {},
            'abstract': {
              fi: 'Tämä on suomenkielinen testiabstrakti. Sisältää huikean kuvauksen kyseisestä kuulemisesta.'
            },
            content: {
              fi: '<p>Samanaikaisesti Isosaaren avaamisen kanssa Helsingin kaupunki aloittaa saaren asemakaavoituksen. Saarta suunnitellaan monipuoliseksi virkistyksen ja matkailun keitaaksi. &nbsp;&nbsp;&nbsp;</p>\n<p>Kerro ajatuksesi Isosaaren kehittämisestä: &nbsp;</p>\n<ul>\n  <li>Minkälaisia matkailupalveluja ja toimintaa Isosaaressa voisi olla?</li>\n  <li>Mikä Isosaaressa on ainutlaatuista?&nbsp;</li>\n  <li>Millainen Isosaari olisi tulevaisuudessa? Ideoita ja visioita käytetään saaren suunnittelun tukena ja innoituksena.&nbsp;</li>\n</ul>\n<p>&nbsp;&nbsp;Ideoita ja visioita käytetään saaren suunnittelun tukena ja innoituksena.</p>\n<p>Lisätietoja:</p>\n<p><a href="http://www.visitisosaari.fi">Tietoa Isosaaressa vieraileville</a></p>'
            }
          }
        ],
        closed: false,
        geojson: {
          type: 'LineString',
          coordinates: [
            [
              25.039301,
              60.106147
            ],
            [
              25.036554,
              60.101441
            ]
          ]
        },
        organization: 'Kaupunkisuunnitteluvirasto',
        slug: 'isosaari',
        main_image: {
          id: 92,
          url: 'https://api.hel.fi/kerrokantasi-test/media/images/2017/10/LzqVMrMI.jpeg',
          width: 893,
          height: 631,
          title: {},
          caption: {
            fi: 'Millainen on Isosaaren tulevaisuus? Kuva: Kaupunkiympäristön toimiala'
          }
        },
        contact_persons: [
          {
            id: 'KmzDwlU21Qs6KPgboWgOwRIBAKi4x60X',
            name: 'Seija Suunnittelija',
            phone: '09 123 456',
            email: 'seija.suunnittelija@hel.fi',
            organization: 'Kaupunkisuunnitteluvirasto',
            title: {
              fi: 'arkkitehti'
            }
          }
        ],
        default_to_fullscreen: false,
        title: {
          fi: 'Ideoi Isosaaren tulevaisuutta'
        },
        borough: {}
      }
    },
    currentlyViewed: '#hearing'
  },
  dispatch: () => {},
  fetchLabels: () => {},
  match: {
    params: {
      tab: 'list'
    }
  },
  location: {
    search: ''
  },
  labels: {
    data: [{id: 1, label: {fi: 'Mock Von Label'}}, {id: 2, label: {fi: 'Mock Don Label'}}]
  },
  user: { },
  hearingLists: {
    allHearings: {
      data: [{
        abstract: {
          fi: 'Tämä on suomenkielinen testiabstrakti. Sisältää huikean kuvauksen kyseisestä kuulemisesta.'
        },
        id: 'rXT2L1HxEOZTERjluyxyQZ412aYM8oZE',
        n_comments: 1,
        published: true,
        labels: [],
        open_at: '2017-10-22T21:00:00Z',
        close_at: '2017-11-28T22:00:00Z',
        created_at: '2017-10-23T11:07:26.630423Z',
        servicemap_url: '',
        closed: false,
        geojson: {
          type: 'LineString',
          coordinates: [
            [
              25.039301,
              60.106147
            ],
            [
              25.036554,
              60.101441
            ]
          ]
        },
        organization: 'Mock Inc',
        slug: 'mockHearing',
        main_image: {
          id: 92,
          url: 'https://api.hel.fi/kerrokantasi-test/media/images/2017/10/LzqVMrMI.jpeg',
          width: 893,
          height: 631,
          title: {},
          caption: {
            fi: 'A Wonderfull caption'
          }
        },
        default_to_fullscreen: false,
        title: {
          fi: 'Mock Hearing'
        },
        borough: {}
      }]
    }
  },
  sectionComments: {
    sectionId: '7CxRxrlvrW9uCCjEaB9rW1dENHQMudeK',
    data: {
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          section: '7CxRxrlvrW9uCCjEaB9rW1dENHQMudeK',
          language_code: '',
          id: 2615,
          content: 'Testi',
          author_name: 'Mikko Uro',
          n_votes: 0,
          created_at: '2017-10-23T11:23:47.475069Z',
          is_registered: true,
          can_edit: false,
          geojson: null,
          images: [],
          label: null,
          hearing: 'rXT2L1HxEOZTERjluyxyQZ412aYM8oZE',
          plugin_data: ''
        }
      ]
    }
  }
};
