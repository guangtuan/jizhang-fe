import { post } from '../core/request'

const SESSION_KEY = "SESSION";

const state = (() => {
    const sessionJSON = localStorage.getItem(SESSION_KEY)
    if (sessionJSON) {
        return JSON.parse(sessionJSON)
    } else {
        return null
    }
})()

export const session = {
    state,
    reducers: {
        set: (state, payload) => {
            return payload
        },
        clear: (state, payload) => {
            localStorage.removeItem(SESSION_KEY)
            return undefined
        }
    },
    effects: (dispatch) => ({
        login: async (payload, rootState) => {
            const session = await post({
                path: 'login',
                data: {
                    username: payload.username,
                    password: payload.password
                }
            })
            localStorage.setItem(SESSION_KEY, JSON.stringify(session))
            dispatch.session.set(session)
        },
        logout: async (payload, rootState) => {
            await post({
                path: 'logout',
                data: payload,
            })
            dispatch.session.clear()
            return true
        }
    })
}
