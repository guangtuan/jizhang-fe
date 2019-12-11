import {init} from '@rematch/core';

describe('subjects', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('reducer: add a subject', () => {
    const {subjects} = require('./subjects');

    const store = init({
      models: {subjects},
    });

    store.dispatch.subjects.add({
      name: 'breakfest',
      desc: '早餐',
    });

    expect(store.getState().subjects).toMatchObject([{
      name: 'breakfest',
      desc: '早餐',
    }]);
  });

  it('reducer: edit a subject', () => {
    const {subjects} = require('./subjects');

    const store = init({
      models: {subjects},
    });

    store.dispatch.subjects.add({
      name: 'breakfest',
      desc: '早餐',
    });

    const {uuid} = store.getState().subjects[0];

    store.dispatch.subjects.edit({
      uuid,
      subject: {
        name: 'breakfest',
        desc: '早饭',
      },
    });

    expect(store.getState().subjects).toMatchObject([{
      name: 'breakfest',
      desc: '早饭',
    }]);
  });

  it('reducer: remove a subject', () => {
    const {subjects} = require('./subjects');

    const store = init({
      models: {subjects},
    });

    store.dispatch.subjects.add({
      name: 'breakfest',
      desc: '早餐',
    });

    store.dispatch.subjects.add({
      name: 'lunch',
      desc: '午餐',
    });

    const {uuid} = store.getState().subjects[0];

    store.dispatch.subjects.remove({
      uuid,
    });

    expect(store.getState().subjects.length).toBe(1);
    expect(store.getState().subjects).toMatchObject([{
      name: 'lunch',
      desc: '午餐',
    }]);
  });
});
