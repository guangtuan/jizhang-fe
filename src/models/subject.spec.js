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

  it('subjects.subjectTree.add', () => {
    const store = getStore();
    const subjectEat = {
      name: 'eat',
      id: 1,
      children: [],
    };
    store.dispatch.subjects.add(subjectEat);
    expect(store.getState().subjects.subjectTree).toStrictEqual([
      subjectEat,
    ]);
    const subjectBreakfest = {
      name: 'breakfest',
      id: 2,
      parentId: 1,
    };
    store.dispatch.subjects.add(subjectBreakfest);
    expect(store.getState().subjects.subjectTree).toStrictEqual([{
      name: 'eat',
      id: 1,
      children: [{
        name: 'breakfest',
        id: 2,
        parentId: 1,
      }],
    }]);
  });

  it('subjects.subjectTree.add, ensure order', () => {
    const store = getStore();
    const subjectEat = {
      name: 'eat',
      id: 1,
      children: [],
    };
    store.dispatch.subjects.add(subjectEat);
    expect(store.getState().subjects.subjectTree).toStrictEqual([
      subjectEat,
    ]);
    const subjectDress = {
      name: 'dress',
      id: 2,
      children: [],
    };
    store.dispatch.subjects.add(subjectDress);
    expect(store.getState().subjects.subjectTree).toStrictEqual([
      {
        name: 'dress',
        id: 2,
        children: [],
      },
      {
        name: 'eat',
        id: 1,
        children: [],
      }
    ]);
  });
});
