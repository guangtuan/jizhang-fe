import * as R from 'ramda';

/**
 * 结算记录
 */
export const accountStateCreation = {
    state: {
        dialogVisibility: false,
        createdAt: new Date(),
        accountId: undefined,
        amount: undefined
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
        clear: (state, payload) => {
            return {
                dialogVisibility: false,
                createdAt: new Date(),
                accountId: undefined,
                amount: undefined
            }
        }
    },
    effects: dispatch => ({

    })
};