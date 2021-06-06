import { get, post } from '../core/request';
import * as R from 'ramda';

export const event = {
    state: {
        content: [],
    },
    reducers: {
        setContent: (state, payload) => {
            return R.assoc('content', payload)(state);
        },
    },
    effects: (dispatch) => ({
        load: async (payload, rootState) => {
            const result = await get({ path: 'api/event' });
            dispatch.event.setContent(result);
            return result;
        },
        create: async ({ name }, rootState) => {
            await post({
                path: 'api/event',
                data: {
                    name
                }
            })
            return true
        },
        link: async ({ detailId, eventId }, rootState) => {
            await post({
                path: 'api/event/link',
                data: {
                    detailId,
                    eventId
                }
            })
            return true
        },
    }),
};
