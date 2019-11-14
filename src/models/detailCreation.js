import * as R from 'ramda';

export const detailCreation = {
    state: {
        dialogVisibility: false,
        user: '',
        source: '',
        dest: '',
        subject: '',
        remark: '',
        amount: 0
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