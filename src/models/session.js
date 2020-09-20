import {post} from '../core/request';

const SESSION_KEY = 'SESSION';

const state = (() => {
  const sessionStore = localStorage.getItem(SESSION_KEY);
  if (sessionStore) {
    return JSON.parse(sessionStore);
  } else {
    return null;
  }
})();

export const session = {
  name: 'session',
  state,
  reducers: {
    set: (state, payload) => {
      console.log('model: session: set', JSON.stringify(payload));
      return payload;
    },
    clear: (state, payload) => {
      console.log('model: session: clear');
      localStorage.removeItem(SESSION_KEY);
      return undefined;
    },
  },
  effects: (dispatch) => ({
    login: async (payload, rootState) => {
      const session = await post({
        path: 'login',
        data: {
          email: payload.email,
          password: payload.password,
        },
      });
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return dispatch.session.set(session);
    },
    logout: async (payload, rootState) => {
      await post({
        path: 'logout',
        data: payload,
      });
      dispatch.session.clear();
      return true;
    },
  }),
};
