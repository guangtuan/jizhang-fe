import {append, assoc, findIndex, ifElse, lensIndex, lensProp, over, propEq, mergeLeft} from 'ramda';
import {get, post} from '../core/request';

const defaultForm = () => ({
  name: '',
  description: '',
  parentId: undefined,
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
        data: mergeLeft({by: 'level'})(payload),
      });
      console.log(subjects);
      dispatch.subjects.setDisplay(subjects);
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
