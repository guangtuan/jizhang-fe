import { post, get, del } from '../core/request';
import * as R from 'ramda';

export const details = {
    state: {
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: 15
        }
    },
    reducers: {
        set: (state, payload) => {
            return payload;
        },
        pageChange: (state, payload) => {
            state.pageable.pageNumber = payload
            return state
        }
    },
    effects: dispatch => ({
        load: async (payload, rootState) => {
            const details = await get({
                path: "api/details",
                payload
            });
            dispatch.details.set(details)
        },
        create: async (payload, rootState) => {
            await post({
                path: "api/details",
                data: payload
            });
            return true;
        },
        del: async (payload, rootState) => {
            await del({
                path: `api/details/${payload}`
            });
            return true;
        }
    })
};