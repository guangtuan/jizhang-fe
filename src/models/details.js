import * as R from 'ramda';

export const details = {
    state: [],
    reducers: {
        add: (state, payload) => {
            return R.append(payload, state);
        },
        edit: (state, { detail, index }) => {
            return R.update(index, detail, state);
        },
        remove: (state, { index }) => {
            return R.remove(index, 1, state);
        }
    },
    effects: dispatch => ({

    })
};