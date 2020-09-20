import * as R from 'ramda';
import {put} from '../core/request';

export const detailEdit = {
  state: {
    dialogVisibility: false,
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
      return R.compose(
          R.assoc('amount', payload.amount / 100),
          R.assoc('createdAt', new Date(payload.createdAt)),
      )(payload);
    },
  },
  effects: (dispatch) => ({
    update: async (payload, rootState) => {
      const resp = await put({
        path: `api/details/${payload.id}`,
        data: payload.payload,
      });
      return resp;
    },
  }),
};
