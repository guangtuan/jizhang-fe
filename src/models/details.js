import { post, get, del } from '../core/request';
import { __, prop, propEq, assoc, findIndex, update, merge, compose } from 'ramda';

export const details = {
  state: {
    content: [],
    total: 0
  },
  reducers: {
    updateSingleRow: (state, payload) => {
      const indexToUpdate = findIndex(propEq('id', payload.id))(prop('content')(state))
      return assoc('content', update(indexToUpdate, payload)(prop('content')(state)))(state)
    },
    set: (state, payload) => {
      return payload;
    }
  },
  effects: (dispatch) => ({
    load: async (payload, rootState) => {
      const details = await post({
        path: 'api/details/query',
        data: payload
      });
      const modify = compose(
        assoc(
          'content', details.content
        ),
        assoc('total', details.total)
      )
      dispatch.details.set(
        modify(rootState.details)
      );
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
