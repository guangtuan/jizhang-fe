import {append, assoc, findIndex, ifElse, lensIndex, lensProp, over, propEq,} from 'ramda';
import {get, post} from '../core/request';

const defaultForm = () => ({
  name: '',
  description: '',
  parentId: undefined
});

export const subjects = {
  name: 'subjects',
  state: {
    list: [],
    form: defaultForm(),
    creating: false
  },
  reducers: {
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
            over(lensProp('children'), append(payload))
          )
        ),
        over(lensProp('list'), append(payload))
      )(state)
    }
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
      dispatch.subjects.add(subjects);
      return true;
    },
  }),
};
