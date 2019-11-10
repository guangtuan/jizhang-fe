import axios from 'axios';

const SUCCESS_CODES = [200, 201];
const NO_ACCESS_CODES = [401, 403];
const CLIENT_ERROR = [400, 409];
const SERVER_ERROR_CODES = [500];
const NOT_FOUND_CODES = [404];

export const TOKEN_KEY = 'token'

const getToken = () => localStorage.getItem(TOKEN_KEY)
const clearToken = () => localStorage.removeItem(TOKEN_KEY)

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
    const ret = window.location.protocol + "//" + window.location.host;
    if (window.location.port) {
        return [ret, window.location.port].join(":");
    } else {
        return ret;
    }
};

export const get = async ({ path }) => {
    console.log("process.env.REACT_APP_HOST", process.env.REACT_APP_HOST);
    const fullUrl = [process.env.REACT_APP_HOST || getFromWindow(), path].join('/');
    const data = await axios.get(fullUrl);
    return data.data
};

export const post = async ({ path, data }) => {
    console.log("process.env.REACT_APP_HOST", process.env.REACT_APP_HOST);
    const url = [process.env.REACT_APP_HOST || getFromWindow(), path].join('/');
    const resp = await axios({
        headers: { 'content-type': 'application/json' },
        method: 'post',
        url,
        data: JSON.stringify(data)
    });
    return resp.data;
};