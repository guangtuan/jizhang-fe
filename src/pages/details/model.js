import { get, post, put, del } from '../../core/request';

export const model = {
    load: async (data) => {
        return await post({
            path: 'api/details/query',
            data,
        });
    },
    create: async (data) => {
        return await post({
            path: 'api/details',
            data,
        });
    },
    del: async (data) => {
        return await del({
            path: `api/details/${data}`,
        });
    },

}