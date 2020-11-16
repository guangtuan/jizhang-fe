import { append, assoc, assocPath, findIndex, ifElse, lensIndex, lensProp, over, propEq, mergeLeft } from 'ramda';
import { get, post } from '../core/request';

const defaultForm = () => ({
  name: '',
  description: '',
  parentId: null,
  level: 1
});

export const subjects = {
  name: 'subjects',
  state: {
    list: [],
    display: [],
    form: defaultForm(),
    creating: false,
  },
  reducers: {
    hideDialog: (state, payload) => {
      return assoc('creating', false)(state);
    },
    showDialog: (state, payload) => {
      return assoc('creating', true)(state);
    },
    setForm: (state, payload) => {
      return assoc('form', payload)(state);
    },
    clearForm: (state, payload) => {
      return assoc('form', defaultForm())(state);
    },
    changeProperty: (state, payload) => {
      const apply = assocPath(['form', payload.key], payload.val);
      return apply(state);
    },
    setDisplay: (state, payload) => {
      return assoc('display', payload)(state);
    },
    set: (state, payload) => {
      return assoc('list', payload)(state);
    },
    add: (state, payload) => {
      return ifElse(
        () => payload.parentId,
        over(
          lensProp('list'),
          over(
            lensIndex(findIndex(propEq('id', payload.parentId))(state.list)),
            over(lensProp('children'), append(payload)),
          ),
        ),
        over(lensProp('list'), append(payload)),
      )(state);
    },
  },
  effects: (dispatch) => ({
    loadByLevel: async (payload, rootState) => {
      const subjects = await get({
        path: 'api/subjects',
        data: mergeLeft({ by: 'level' })(payload),
      });
      dispatch.subjects.setDisplay(subjects);
      return subjects;
    },
    load: async (payload, rootState) => {
      const subjects = await get({
        path: 'api/subjects',
        data: payload,
      });
      dispatch.subjects.set(subjects);
    },
    create: async (payload, rootState) => {
      await post({
        path: 'api/subjects',
        data: payload,
      });
      dispatch.subjects.add(subjects);
      return true;
    },
  }),
};
