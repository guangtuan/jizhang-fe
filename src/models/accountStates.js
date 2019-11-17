import { post, get } from '../core/request';
import * as R from 'ramda';

export const accountStates = {
    state: {
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: 10
        },
    },
    selectors: {
        query() {
            return (rootState, props) => {
                const transformToQuery = R.applySpec({
                    page: R.pipe(R.prop('pageable'), R.prop('pageNumber')),
                    size: R.pipe(R.prop('pageable'), R.prop('pageSize'))
                });
                return transformToQuery(rootState.accountStates)
            }
        }
    },
    reducers: {
        set: (state, payload) => {
            return payload;
        },
        append: (state, payload) => {
            return R.assoc('conent')(R.append(payload)(state.conent))
        },
        pageChange: (state, payload) => {
            state.pageable.pageNumber = payload
            return state
        }
    },
    effects: dispatch => ({
        load: async (payload, rootState) => {
            const resp = await get({
                path: "api/accountStates",
                payload
            });
            dispatch.accountStates.set(resp)
        },
        create: async (payload, rootState) => {
            await post({
                path: "api/accountStates",
                data: payload
            });
            return true;
        }
    })
};