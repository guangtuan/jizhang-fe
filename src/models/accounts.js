import {post, get} from '../core/request';
import * as R from 'ramda';

export const accounts = {
  state: [],
  reducers: {
    set: (state, payload) => {
      return payload;
    },
    append: (state, payload) => {
      return R.append(payload)(state);
    },
  },
  effects: (dispatch) => ({
    load: async (payload, rootState) => {
      const accounts = await get({
        path: 'api/accounts',
      });
      dispatch.accounts.set(accounts);
    },
    create: async (payload, rootState) => {
      const account = await post({
        path: 'api/accounts',
        data: payload,
      });
      dispatch.accounts.append(account);
      return true;
    },
  }),
};
