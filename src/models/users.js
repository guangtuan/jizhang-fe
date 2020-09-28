import {append, assoc, prop} from 'ramda';
import {get, post} from '../core/request';

const defaultForm = () => ({
  email: '',
  account: '',
  password: '',
});

export const users = {
  state: {
    content: [],
    creating: false,
    form: defaultForm(),
  },
  reducers: {
    set: (state, payload) => {
      return assoc(
        'content',
        payload,
        state,
      );
    },
    append: (state, payload) => {
      return assoc(
        'content',
        append(payload)(prop('content')(state)),
        state,
      );
    },
    clearUserForm: (state, payload) => {
      return assoc('form', defaultForm())(state);
    },
    changeProperty: (state, payload) => {
      return assoc(
        'form',
        assoc(payload.key, payload.val)(prop('form')(state))
      )(state);
    },
    showCreateUserDialog: (state, payload) => {
      return assoc('creating', true)(state);
    },
    hideUserDialog: (state, payload) => {
      return assoc('creating', false)(state);
    },
  },
  effects: (dispatch) => ({
    load: async (payload, rootState) => {
      const users = await get({
        path: 'api/user',
      });
      dispatch.users.set(users);
    },
    createUser: async (payload, rootState) => {
      const user = await post({
        path: 'api/user',
        data: payload,
      });
      dispatch.users.append(user);
      return true;
    },
  }),
};
