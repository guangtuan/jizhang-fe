import { post, get, del } from '../core/request';
import { __, prop, propEq, when, map, curry, assoc, find, findIndex, update } from 'ramda';

export const details = {
  state: {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 15,
    },
  },
  reducers: {
    updateSingleRow: (state, payload) => {
      const indexToUpdate = findIndex(propEq('id', payload.id))(prop('content')(state))
      return assoc('content', update(indexToUpdate, payload)(prop('content')(state)))(state)
    },
    set: (state, payload) => {
      return payload;
    },
    pageChange: (state, payload) => {
      state.pageable.pageNumber = payload;
      return state;
    },
  },
  effects: (dispatch) => ({
    load: async (payload, rootState) => {
      const details = await get({
        path: 'api/details',
        payload,
      });
      dispatch.details.set(details);
    },
    create: async (payload, rootState) => {
      await post({
        path: 'api/details',
        data: payload,
      });
      return true;
    },
    del: async (payload, rootState) => {
      await del({
        path: `api/details/${payload}`,
      });
      return true;
    },
  }),
};
