import {post, get} from '../core/request';
import * as R from 'ramda';

export const subjects = {
  name: 'subjects',
  state: {
    content: [],
    pageable: {
      pageNumber: 0,
      pageSize: 100,
    },
  },
  reducers: {
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
      const subjects = await get({
        path: 'api/subjects',
        payload,
      });
      dispatch.subjects.set(subjects);
    },
    create: async (payload, rootState) => {
      await post({
        path: 'api/subjects',
        data: payload,
      });
      return true;
    },
  }),
};
