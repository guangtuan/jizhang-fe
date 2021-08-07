import { del, post } from '../core/request'
import { assoc, compose, findIndex, prop, propEq, update } from 'ramda'

export const details = {
    state: {
        content: [],
        total: 0,
    },
    reducers: {
        updateSingleRow: (state, payload) => {
            const getContent = prop('content')
            const indexById = findIndex(propEq('id', payload.id))
            const indexToUpdate = indexById(getContent(state))
            return assoc(
                'content',
                update(indexToUpdate, payload)(getContent(state)),
            )(state)
        },
        set: (state, payload) => {
            return payload
        },
    },
    effects: (dispatch) => ({
        load: async (payload, rootState) => {
            const details = await post({
                path: 'api/details/query',
                data: payload,
            })
            const modify = compose(
                assoc(
                    'content', details.content,
                ),
                assoc('total', details.total),
            )
            dispatch.details.set(
                modify(rootState.details),
            )
        },
        create: async (payload, rootState) => {
            return await post({
                path: 'api/details',
                data: payload,
            })
        },
        del: async (payload, rootState) => {
            await del({
                path: `api/details/${payload}`,
            })
            return true
        },
    }),
}
