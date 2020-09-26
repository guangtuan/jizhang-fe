import {init} from '@rematch/core';
import {accounts} from './accounts';

describe('test account', () => {
  const getStore = () => {
    return init({
      models: {accounts},
    });
  };

  it('store contains key: account', () => {
    const store = getStore();
    expect(Object.keys(store.getState()).includes('account')).toBe(true);
  });

  it('account append', () => {
    const store = getStore();
    store.dispatch.accounts.append({
      userId: 1,
      name: 'test',
      description: 'test desc',
      type: 'assets',
    });
    expect(store.getState().accounts.length).toBe(1);
  });

  it('account updateSingleRow', () => {
    const store = getStore();
    store.dispatch.accounts.append({
      id: 1,
      userId: 1,
      name: 'test',
      description: 'test desc',
      type: 'assets',
    });
    expect(store.getState().accounts.length).toBe(1);
    store.dispatch.accounts.updateSingleRow({
      id: 1,
      userId: 2,
      name: 'newAccount',
      description: 'new dest',
      type: 'new type',
    });
    expect(store.getState().accounts).toStrictEqual([{
      id: 1,
      userId: 2,
      name: 'newAccount',
      description: 'new dest',
      type: 'new type',
    }]);
  });
});
