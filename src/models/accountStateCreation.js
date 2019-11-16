import * as R from 'ramda';

/**
 * 结算记录
 */
export const accountStateCreation = {
    state: {
        dialogVisibility: false,
        createdAt: new Date(),
        accountId: -1,
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