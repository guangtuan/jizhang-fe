import * as R from 'ramda';

export const subjectCreation = {
    state: {
        dialogVisibility: false,
        name: '',
        description: '',
        tags: ''
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
            return {
                dialogVisibility: false,
                name: '',
                description: '',
                tags: ''
            }
        }
    },
    effects: dispatch => ({

    })
};