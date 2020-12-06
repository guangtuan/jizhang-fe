import {
  assoc,
  assocPath,
  findIndex,
  ifElse,
  lensIndex,
  lensProp,
  over,
  propEq,
  mergeLeft,
  compose,
  flatten,
  map,
  prop,
  insert
} from 'ramda';

import { get, post, del } from '../core/request';

const defaultForm = () => ({
  name: '',
  description: '',
  parentId: null,
  level: 1
});

const flatedChildren = compose(flatten, map(prop('children')));

export const subjects = {
  name: 'subjects',
  state: {
    subjectTree: [],
    display: [],
    form: defaultForm(),
    flatedChildren: [],
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
    setSubjectTree: (state, payload) => {
      return assoc('subjectTree', payload)(state);
    },
    setFlatedChildren: (state, payload) => {
      return assoc('flatedChildren', payload)(state);
    },
    add: (state, payload) => {
      const addNew = insert(0);
      return ifElse(
        () => payload.parentId,
        over(
          lensProp('subjectTree'),
          over(
            lensIndex(findIndex(propEq('id', payload.parentId))(state.subjectTree)),
            over(lensProp('children'), addNew(payload)),
          ),
        ),
        over(lensProp('subjectTree'), addNew(payload)),
      )(state);
    },
  },
  effects: (dispatch) => ({
    del: async (payload, rootState) => {
      return del({
        path: `api/subjects/${payload}`
      });
    },
    loadByLevel: async (payload, rootState) => {
      const subjects = await get({
        path: 'api/subjects',
        data: mergeLeft({ by: 'level' })(payload),
      });
      dispatch.subjects.setDisplay(subjects);
      return subjects;
    },
    load: async (payload, rootState) => {
      const subjectTree = await get({
        path: 'api/subjects',
        data: payload,
      });
      dispatch.subjects.setSubjectTree(subjectTree);
      dispatch.subjects.setFlatedChildren(flatedChildren(subjectTree));
    },
    create: async (payload, rootState) => {
      const newSubject = await post({
        path: 'api/subjects',
        data: payload,
      });
      dispatch.subjects.add(newSubject);
      return true;
    },
  }),
};
