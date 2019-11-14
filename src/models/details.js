import { post, get } from '../core/request';
import * as R from 'ramda';

export const details = {
    state: [],
    reducers: {
        set: (state, payload) => {
            return payload;
        },
        append: (state, payload) => {
            return R.append(payload)(state)
        }
    },
    effects: dispatch => ({
        load: async (payload, rootState) => {
            const details = await get({
                path: "api/details"
            });
            dispatch.details.set(details)
        },
        create: async (payload, rootState) => {
            const detail = await post({
                path: "api/details",
                data: payload
            });
            dispatch.details.append(detail)
            return true;
        }
    })
};