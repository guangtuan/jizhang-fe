import axios from 'axios'
import queryString from 'query-string'
import { path } from 'ramda'
import { session } from '../models'

const SESSION_KEY = 'SESSION'

class JizhangAppError extends Error {
    constructor (status, message) {
        super(message)
        this.status = status
        this.message = message
        this.stack = (new Error()).stack
    }
}

axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.log(error)
        if (error.response) {
            // clear token
            if (error.response.status === 401) {
                window.location.href = '/'
                session.reducers.clear()
            }
        }
        throw new JizhangAppError(error.response.status, error.message)
    },
)

const getFromWindow = () => {
    return window.location.protocol + '//' + window.location.host
}

const getHeaders = () => {
    const sessionStore = localStorage.getItem(SESSION_KEY)
    if (sessionStore) {
        const sessionCopy = JSON.parse(sessionStore)
        return {
            'content-type': 'application/json',
            'email': path(['email'])(sessionCopy),
            'token': path(['token'])(sessionCopy),
        }
    } else {
        return {
            'content-type': 'application/json',
        }
    }
}

export const get = async ({ path, data }) => {
    const url = [path, queryString.stringify(data)].join('?')
    const resp = await axios({
        url,
        headers: getHeaders(),
        methods: 'get',
    })
    return resp.data
}

export const post = async ({ path, data }) => {
    const resp = await axios({
        headers: getHeaders(),
        method: 'post',
        url: path,
        data: JSON.stringify(data),
    })
    return resp.data
}

export const put = async ({ path, data, params }) => {
    const url = [
        [getFromWindow(), path].join('/'),
        queryString.stringify(params),
    ].join('?')
    const resp = await axios({
        headers: getHeaders(),
        method: 'put',
        url,
        data: JSON.stringify(data),
    })
    return resp.data
}

export const del = async ({ path, data }) => {
    const url = [getFromWindow(), path].join('/')
    const resp = await axios({
        headers: getHeaders(),
        method: 'delete',
        url,
        data: JSON.stringify(data),
    })
    return resp.data
}
