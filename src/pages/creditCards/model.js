import { get, post, put } from '../../core/request';

export const model = {

    list: async () => {
        return get({
            path: '/api/creditCards'
        })
    },

    create: async data => {
        return post({
            path: '/api/creditCards',
            data
        })
    }
}