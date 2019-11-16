import * as R from 'ramda';

export const accountCreation = {
    state: {
        dialogVisibility: false,
        type: '',
        userId: '',
        name: '',
        description: ''
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
        }
    },
    effects: dispatch => ({

    })
};