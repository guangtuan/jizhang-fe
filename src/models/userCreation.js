import * as R from 'ramda';

export const userCreation = {
  state: {
    dialogVisibility: false,
    account: '',
    username: '',
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
  },
  effects: (dispatch) => ({

  }),
};
