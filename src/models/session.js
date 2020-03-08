import { post } from '../core/request';

export const session = {
    state: {
        token: undefined
    },
    reducers: {
        set: (state, payload) => {
            return payload;
        },
        clear: (state, payload) => {
            return undefined;
        }
    },
    effects: (dispatch) => ({
        login: async (payload, rootState) => {
            const session = await post({
                path: 'login',
                data: {
                    username: payload.username,
                    password: payload.password
                }
            });
            dispatch.session.set(session);
        },
        logout: async (payload, rootState) => {
            await post({
                path: 'logout',
                data: payload,
            });
            dispatch.session.clear();
            return true;
        }
    })
};
