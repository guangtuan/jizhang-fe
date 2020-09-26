import * as R from 'ramda';
import {put, post} from '../core/request';

const defaultForm = () => ({
  userId: -1,
  sourceAccountId: -1,
  destAccountId: -1,
  subjectId: '',
  remark: '',
  amount: undefined,
  createdAt: new Date(),
});

export const detailEdit = {
  state: {
    dialogVisibility: false,
    creating: false,
    editing: false,
    form: defaultForm(),
  },
  reducers: {
    changeProperty: (state, payload) => {
      const apply = R.assocPath(['form', payload.key], payload.val);
      return apply(state);
    },
    hideDialog: (state, payload) => {
      const apply = R.pipe(
          R.assoc('dialogVisibility', false),
          R.assoc('creating', false),
          R.assoc('editing', false),
      );
      return apply(state);
    },
    showEditDialog: (state, payload) => {
      const apply = R.pipe(
          R.assoc('dialogVisibility', true),
          R.assoc('editing', true),
      );
      return apply(state);
    },
    showCreateDialog: (state, payload) => {
      const apply = R.pipe(
          R.assoc('dialogVisibility', true),
          R.assoc('creating', true),
      );
      return apply(state);
    },
    clearForm: (state, payload) => {
      return R.assoc('form', defaultForm())(state);
    },
    setForm: (state, payload) => {
      const process = R.pipe(
          R.assoc('amount', payload.amount / 100),
          R.assoc('createdAt', new Date(payload.createdAt)),
      );
      return R.assoc('form', process(payload))(state);
    },
  },
  effects: (dispatch) => ({
    create: async (payload, rootState) => {
      const resp = await post({
        path: 'api/details',
        data: payload,
      });
      return resp;
    },
    update: async (payload, rootState) => {
      console.log(JSON.stringify(payload));
      const resp = await put({
        path: `api/details/${payload.id}`,
        data: payload.payload,
      });
      return resp;
    },
  }),
};
