import cloneInitialState from './cloneInitialState';
import initialState from './initialState';
import { createRootReducer } from './reducers/rootReducer';

describe('cloneInitialState', () => {
  it('should copy nested containers and keep functions and class instances by reference', () => {
    class Foo {}
    const foo = new Foo();
    const fn = () => {};
    const source = { list: [{ a: 1 }], set: new Set([1]), map: new Map([['k', { b: 2 }]]), foo, fn };
    const copy = cloneInitialState(source);

    expect(copy).toEqual(source);
    expect(copy.list).not.toBe(source.list);
    expect(copy.list[0]).not.toBe(source.list[0]);
    expect(copy.set).not.toBe(source.set);
    expect(copy.map.get('k')).not.toBe(source.map.get('k'));
    expect(copy.foo).toBe(foo);
    expect(copy.fn).toBe(fn);
  });

  it('should give two stores no shared containers', () => {
    const a = createRootReducer('a')(undefined, { type: '@@INIT' });
    const b = createRootReducer('b')(undefined, { type: '@@INIT' });

    expect(a.viewer.unreadAnnotationIdSet).not.toBe(b.viewer.unreadAnnotationIdSet);
    expect(a.viewer.unreadAnnotationIdSet).not.toBe(initialState.viewer.unreadAnnotationIdSet);
    expect(a.viewer.measurementScalePreset).not.toBe(b.viewer.measurementScalePreset);
  });
});
