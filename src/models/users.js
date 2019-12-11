import {post, get} from '../core/request';
import * as R from 'ramda';

export const users = {
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
      const users = await get({
        path: 'api/user',
      });
      dispatch.users.set(users);
    },
    create: async (payload, rootState) => {
      const user = await post({
        path: 'api/user',
        data: payload,
      });
      dispatch.users.append(user);
      return true;
    },
  }),
};
