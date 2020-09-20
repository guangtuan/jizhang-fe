import {post, get} from '../core/request';

export const subjects = {
  name: 'subjects',
  state: [],
  reducers: {
    set: (state, payload) => {
      return payload;
    },
  },
  effects: (dispatch) => ({
    load: async (payload, rootState) => {
      try {
        const subjects = await get({
          path: 'api/subjects',
          payload,
        });
        dispatch.subjects.set(subjects);
      } catch (err) {

      }
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
