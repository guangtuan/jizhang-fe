import { post, get } from '../core/request';
import * as R from 'ramda';
import dayjs from 'dayjs';

export const statistics = {
    state: {
        content: [],
        dateRange: [
            dayjs().subtract(1, 'month').set("date", 1).toDate(),
            dayjs().set("date", 1).set("date", 0).toDate()
        ],
        subjects: []
    },
    reducers: {
        setContent: (state, payload) => {
            return R.assoc('content', payload)(state);
        },
        setDateRange: (state, payload) => {
            state.dateRange = payload;
            return state;
        },
        changeSubjects: (state, payload) => {
            const { id, action } = payload;
            if (action === 'remove') {
                state.subjects = state.subjects.filter(sub => sub !== id);
            } else {
                state.subjects.push(id);
            }
            return state;
        }
    },
    effects: dispatch => ({
        query: async (payload, rootState) => {
            const result = await post({ path: 'api/stats', data: payload });
            dispatch.statistics.setContent(result);
            return true;
        }
    })
};