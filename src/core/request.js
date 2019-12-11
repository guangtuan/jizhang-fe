import axios from 'axios';
import queryString from 'query-string';

export const TOKEN_KEY = 'token';

const getToken = () => localStorage.getItem(TOKEN_KEY);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ServerError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
};

export class ClientError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
};

const getFromWindow = () => {
  const ret = window.location.protocol + '//' + window.location.host;
  if (window.location.port) {
    return [ret, window.location.port].join(':');
  } else {
    return ret;
  }
};

export const get = async ({path, payload}) => {
  const fullUrl = [process.env.REACT_APP_HOST || getFromWindow(), path].join('/');
  const resp = await axios.get([fullUrl, queryString.stringify(payload)].join('?'));
  return resp.data;
};

export const post = async ({path, data}) => {
  const url = [process.env.REACT_APP_HOST || getFromWindow(), path].join('/');
  const resp = await axios({
    headers: {'content-type': 'application/json'},
    method: 'post',
    url,
    data: JSON.stringify(data),
  });
  return resp.data;
};

export const del = async ({path, data}) => {
  const url = [process.env.REACT_APP_HOST || getFromWindow(), path].join('/');
  const resp = await axios({
    headers: {'content-type': 'application/json'},
    method: 'delete',
    url,
    data: JSON.stringify(data),
  });
  return resp.data;
};
