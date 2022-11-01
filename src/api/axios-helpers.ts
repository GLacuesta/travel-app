// overkill but the purpose of this is to
// prepare any server interaction extension

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { get as _get } from 'lodash';

interface ApiConfig {
  customHeaders?: any;
  baseURL?: string;
}

export interface IAPIRequestError {
  error: string;
  message: string;
  status?: number;
  redirect?: string;
  raw?: object;
}

const handleAPIError = (error: any) => {
  const codes = [500, 404];
  if (codes.includes(_get(error, 'response.status', ''))) {
    console.error(_get(error, 'response.message', ''));
  }
};

const api = ({ baseURL, customHeaders }: ApiConfig) => {
  const headers = {
    ...customHeaders,
  };

  return axios.create({
    baseURL,
    headers,
  });
};

// https://github.com/microsoft/TypeScript/issues/6283
// typescript cannot differentiate promise reject type
/* eslint prefer-promise-reject-errors: 0 */
const handleReturnError = (err: AxiosError): Promise<never> =>
  Promise.reject({
    message: _get(err, 'response.data.message'),
    error: _get(err, 'response.data.error'),
    status: _get(err, 'response.status'),
    redirect: _get(err, 'response.data.redirect'),
    raw: _get(err, 'response.data') || err,
  } as IAPIRequestError);


/* 
*  add post, put, patch for extension
*  customHeaders is basically type any since it'll depend on backend architecture requirement
*  e.g. 'Device-Type' 'Content-Type'
*  type ANY because it's literally anything currently
*/
export const get = async (url: string, customHeaders?: any, axiosConfig?: AxiosRequestConfig) => {
  return api({ customHeaders })
    .get(url, axiosConfig)
    .catch(error => {
      handleAPIError(error);
      return handleReturnError(error);
    });
};
