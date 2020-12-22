import { post, put, del } from '../core/request';
import { prop, propEq, assoc, findIndex, update, compose } from 'ramda';

export const details = {
  state: {
    content: [],
    total: 0,
  },
  reducers: {
    updateSingleRow: (state, payload) => {
      const getContent = prop('content');
      const indexById = findIndex(propEq('id', payload.id));
      const indexToUpdate = indexById(getContent(state));
      return assoc(
        'content',
        update(indexToUpdate, payload)(getContent(state)),
      )(state);
    },
    set: (state, payload) => {
      return payload;
    },
  },
  effects: (dispatch) => ({
    load: async (payload, rootState) => {
      const details = await post({
        path: 'api/details/query',
        data: payload,
      });
      const modify = compose(
        assoc(
          'content', details.content,
        ),
        assoc('total', details.total),
      );
      dispatch.details.set(
        modify(rootState.details),
      );
    },
    updateSplitFlag: async (payload, rootState) => {
      const tips = await put({
        path: `api/details/${payload.id}/splitFlag`,
        params: {
          flag: payload.flag
        }
      });
      return tips;
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
