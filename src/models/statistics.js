import { post } from '../core/request'
import * as R from 'ramda'

export const statistics = {
    state: {
        content: [],
    },
    reducers: {
        setContent: (state, payload) => {
            return R.assoc('content', payload)(state)
        },
    },
    effects: (dispatch) => ({
        query: async (payload, rootState) => {
            const result = await post({ path: 'api/stats', data: payload })
            dispatch.statistics.setContent(result)
            return true
        },
    }),
}
