// @ts-nocheck
/*
  fake backend endpoint, no need to use axios; to above code is overkill
  but useful in real life scenarios
*/

import { get, isEmpty } from 'lodash';
import { buildParams } from '../utils';
import { calculateDistance, getAllCities, getCities } from "./service";

export const setupFakeEndpoint = () => {
  let realFetch = window.fetch;
  window.fetch = function (url, opts) {
    const { method, headers } = opts;
    const body = !isEmpty(get(opts, 'body', {})) && JSON.parse(get(opts, 'body', {}));
    const interceptor = get(headers, 'Custom-Interceptor', '');

    let queryObject = {};
    let path = 'default';
    if (typeof url !== 'string') {
      path = get(url, 'pathname', '');
      queryObject = buildParams(new URLSearchParams(url.search));
    } else {
      path = url;
    }

    return new Promise((resolve, reject) => {
      function fireFakeFetch() {
        /*
        * either use switch or use es6 format below
        *
          switch (true) {
            case path.endsWith('/cities') && method === 'GET': {
              const getCityFn = isEmpty(queryObject) ? getAllCities : getCities;
              return processFakeFetch(queryObject, fakeOk, fakeServerError, interceptor ? getCityFn : null);
            }
            default:
              return realFetch(url, opts)
                  .then(response => resolve(response))
                  .catch(error => reject(error));
          }
        */
        const customXhr = {
          ['/cities']: () => {
              if (method === 'GET') {
                const getCityFn = isEmpty(queryObject) ? getAllCities : getCities;
                return processFakeFetch(queryObject, fakeOk, fakeServerError, interceptor ? getCityFn : null);   
              }
            },
          ['/calculate']: () => {
              if (method === 'POST') {
                return processFakeFetch(body, fakeOk, fakeServerError, interceptor ? calculateDistance : null);   
              }
            },
          'default': () =>
            realFetch(url, opts)
            .then(response => resolve(response))
            .catch(error => reject(error))  
        }
        return customXhr[path]();
      }

      const fakeOk = (body) => resolve({ status: 200, ok: true, json: () => Promise.resolve(JSON.stringify(body))});
      const fakeServerError = (body) => resolve({ status: 500, json: () => Promise.resolve(JSON.stringify({ body })) });

      // client-side error
      const fakeError = (mesbodysage) => resolve({ status: 400, json: () => Promise.resolve(JSON.stringify({ body })) });

      setTimeout(fireFakeFetch, 700);
    });
  }
}

export const parseResponse = (response) => {
  return response.json().then((res) => {
    const data = res && JSON.parse(res);
    if (!response.ok) {
      const payloadError = get(data, 'body.error', '');
      const error = {
        data: (data && data.body) || response.statusText,
        status: response.status,
        message: payloadError ? `Unsupported city: ${payloadError}` : 'Invalid record', 
      };
      if (response.status > 399 && response.status < 500 ) {
          // usually, either token error or incorrect payload
          console.error('Error in client');
      }
      return Promise.reject(error);
    }
    return data;
  });
}

export const processFakeFetch = (
  record,
  okCb,
  errorCb,
  interceptorFn
) => !!interceptorFn ? interceptorFn(record, okCb, errorCb) : okCb({ ...record });
