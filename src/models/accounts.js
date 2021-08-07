import { append, compose, filter, findIndex, not, prop, propEq, update } from 'ramda'
import { del, get, post, put } from '../core/request'

export const accounts = {
    state: [],
    reducers: {
        set: (state, payload) => {
            return payload
        },
        append: (state, payload) => {
            return append(payload)(state)
        },
        remove: (state, payload) => {
            return filter(compose(not, propEq('id', prop('id')(payload))))(state)
        },
        updateSingleRow: (state, payload) => {
            const indexById = findIndex(propEq('id', payload.id))
            const indexToUpdate = indexById(state)
            return update(indexToUpdate, payload)(state)
        },
    },
    effects: (dispatch) => ({
        load: async (payload, rootState) => {
            const accounts = await get({
                path: 'api/accounts',
            })
            dispatch.accounts.set(accounts)
        },
        create: async (payload, rootState) => {
            const account = await post({
                path: 'api/accounts',
                data: payload,
            })
            dispatch.accounts.append(account)
            return true
        },
        update: async (payload, rootState) => {
            const account = await put({
                path: 'api/accounts/' + payload.id,
                data: payload.payload,
            })
            dispatch.accounts.updateSingleRow(account)
            return true
        },
        del: async (payload, rootState) => {
            await del({
                path: 'api/accounts/' + payload.id,
            })
            dispatch.accounts.remove(payload)
            return true
        },
    }),
}
