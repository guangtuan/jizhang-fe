import * as R from 'ramda';
import { uuid } from '../core';

export const subjects = {
    state: [],
    reducers: {
        add: (state, payload) => {
            return R.append(R.assoc("uuid", uuid())(payload), state);
        },
        edit: (state, { uuid, subject }) => {
            return R.update(R.findIndex(R.propEq('uuid', uuid))(state), subject, state);
        },
        remove: (state, { uuid }) => {
            return R.reject(R.propEq('uuid', uuid), state);
        }
    },
    effects: dispatch => ({

    })
};