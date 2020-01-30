import * as R from 'ramda';
import { put } from '../core/request';

export const detailEdit = {
    state: {
        dialogVisibility: false
    },
    reducers: {
        changeProperty: (state, payload) => {
            return R.assoc(payload.key, payload.val)(state);
        },
        showDialog: (state, payload) => {
            return R.assoc('dialogVisibility', true)(state);
        },
        hideDialog: (state, payload) => {
            return R.assoc('dialogVisibility', false)(state);
        },
        clear: () => {
            return {};
        },
        set: (state, payload) => {
            payload.createdAt = new Date(payload.createdAt);
            payload.amount = payload.amount / 100;
            return payload;
        },
    },
    effects: (dispatch) => ({
        update: async (payload, rootState) => {
            await put({
                path: `api/details/${payload.id}`,
                data: payload.payload
            });
            return true;
        },
    })
};
