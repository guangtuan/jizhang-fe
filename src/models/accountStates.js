import { post, get } from '../core/request';
import * as R from 'ramda';

export const accountStates = {
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
            const accountStates = await get({
                path: "api/accountStates"
            });
            dispatch.accountStates.set(accountStates)
        },
        create: async (payload, rootState) => {
            const accountState = await post({
                path: "api/accountStates",
                data: payload
            });
            dispatch.accountStates.append(accountState)
            return true;
        }
    })
};