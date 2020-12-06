import { init } from '@rematch/core';
import { subjects } from './subjects';

describe('test subjects', () => {
  const getStore = () => {
    return init({
      models: { subjects },
    });
  };

  it('store contains key: subjects', () => {
    const store = getStore();
    expect(Object.keys(store.getState()).includes('subjects')).toBe(true);
  });
  
});
