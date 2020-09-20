import { init } from '@rematch/core';
import { detailEdit } from './detailEdit';

describe('test detail edit', () => {

    const getStore = () => {
        return init({
            models: { detailEdit }
        });
    };

    it('store contains key: detailEdit', () => {
        const store = getStore();
        expect(Object.keys(store.getState()).includes('detailEdit')).toBe(true);
    });

    it('detailEdit.changeProperty', () => {
        const store = getStore();
        store.dispatch.detailEdit.changeProperty({key: 'sourceAccountId', val: 1});
        expect(store.getState().detailEdit.form.sourceAccountId).toBe(1);
    });

});