import { post, get } from '../core/request';
import * as R from 'ramda';

export const subjects = {
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
            const subjects = await get({
                path: "api/subjects"
            });
            dispatch.subjects.set(subjects)
        },
        create: async (payload, rootState) => {
            const subject = await post({
                path: "api/subjects",
                data: payload
            });
            dispatch.subjects.append(subject)
            return true;
        }
    })
};