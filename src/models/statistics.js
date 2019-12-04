import { post, get } from '../core/request';
import * as R from 'ramda';
import dayjs from 'dayjs';

export const statistics = {
    state: {
        content: [],
        dateRange: [
            dayjs().subtract(1, 'month').set("date", 1).toDate(),
            dayjs().set("date", 1).set("date", 0).toDate()
        ]
    },
    reducers: {
        setContent: (state, payload) => {
            return R.assoc('content', payload)(state);
        },
        setDateRange: (state, payload) => {
            state.dateRange = payload
            return state
        }
    },
    effects: dispatch => ({
        query: async (payload, rootState) => {
            const result = await get({ path: 'api/stats', payload });
            dispatch.statistics.setContent(result);
            return true;
        }
    })
};