import { areConfigsEquivalent,
  isPlainObject,
  isEmptyPlainObject,
  areArraysShallowEqual,
  areEntriesShallowEqual,
  shallowValueEqual,
} from './compareObjects';

describe('Testing areConfigsEquivalent and hasConfigDiff methods integration', () => {
  const objectBase = () => ({
    dataElement: 'customButton',
    className: 'custom-button-class',
    label: 'test',
    title: 'this is a test button',
    onClick: () => console.log('button clicked!'),
    img: 'icon-save',
    style: { },
    groupedItems: [],
    store: { anything: 1 },
    items: [{ x: 1 }],
  });

  test('should return configs are equivalent when incoming is identical (different key order allowed)', () => {
    const existingComponent = objectBase();
    const incomingComponent = {
      dataElement: 'customButton',
      className: 'custom-button-class',
      title: 'this is a test button',
      label: 'test',
      groupedItems: [],
      img: 'icon-save',
      onClick: () => console.log('button clicked!'),
      style: { },
    };

    const equivalentConfigs = areConfigsEquivalent(existingComponent, incomingComponent);
    expect(equivalentConfigs).toBe(true);
  });

  test('should return configs are equivalent when incoming is a subset with same values', () => {
    const existingComponent = objectBase();
    const incomingComponent = {
      dataElement: 'customButton',
      className: 'custom-button-class',
      title: 'this is a test button',
    };

    const equivalentConfigs = areConfigsEquivalent(existingComponent, incomingComponent);
    expect(equivalentConfigs).toBe(true);
  });

  test('should return configs are equivalent when a value differs (e.g., title)', () => {
    const existingComponent = objectBase();
    const incomingComponent = {
      dataElement: 'customButton',
      className: 'custom-button-class',
      title: 'this is a different test button title',
      label: 'test',
      groupedItems: [],
    };

    const equivalentConfigs = areConfigsEquivalent(existingComponent, incomingComponent);
    expect(equivalentConfigs).toBe(false);
  });

  test('should return configs are NOT equivalent when incoming introduces a new key not in existing', () => {
    const existingComponent = objectBase();
    const incomingComponent = {
      dataElement: 'customButton',
      className: 'custom-button-class',
      title: 'this is a test button',
      label: 'test',
      groupedItems: [],
      newKey: 'newValue',
    };

    const equivalentConfigs = areConfigsEquivalent(existingComponent, incomingComponent);
    expect(equivalentConfigs).toBe(false);
  });

  test('should return configs are equivalent when incoming comes with undefined values', () => {
    const existingComponent = objectBase();
    const incomingComponent = {
      dataElement: 'customButton',
      className: 'custom-button-class',
      title: 'this is a test button',
      groupedItems: [],
      label: undefined,
    };

    const equivalentConfigs = areConfigsEquivalent(existingComponent, incomingComponent);
    expect(equivalentConfigs).toBe(true);
  });

  test('treats empty plain objects as equal ({} vs {} and {} vs { a: undefined })', () => {
    const existingComponent = { ...objectBase(), style: {} };
    const incoming1 = { dataElement: 'customButton', style: {} };
    const incoming2 = { dataElement: 'customButton', style: { a: undefined } };

    expect(areConfigsEquivalent(existingComponent, incoming1)).toBe(true);
    expect(areConfigsEquivalent(existingComponent, incoming2)).toBe(true);
  });

  test('treats functions as equal if both values are functions', () => {
    const existingComponent = objectBase();
    const incomingComponent = {
      dataElement: 'customButton',
      onClick: () => {
        console.log('button clicked!');
      },
    };

    const equivalentConfigs = areConfigsEquivalent(existingComponent, incomingComponent);
    expect(equivalentConfigs).toBe(true);
  });

  test('arrays are order-sensitive: same order -> equal, different order -> changed', () => {
    const existingComponent = { ...objectBase(), groupedItems: ['a', 'b', 'c'] };
    const sameOrder = { dataElement: 'customButton', groupedItems: ['a', 'b', 'c'] };
    expect(areConfigsEquivalent(existingComponent, sameOrder)).toBe(true);

    const differentOrder = { dataElement: 'customButton', groupedItems: ['b', 'a', 'c'] };
    const equivalentConfigs = areConfigsEquivalent(existingComponent, differentOrder);
    expect(equivalentConfigs).toBe(false);
  });

  test('ignores "items" differences by default (nested children are not compared)', () => {
    const existingComponent = objectBase();
    const incomingComponent = {
      dataElement: 'customButton',
      items: [{ x: 999 }, { y: 2 }],
    };

    const equivalentConfigs = areConfigsEquivalent(existingComponent, incomingComponent);
    expect(equivalentConfigs).toBe(true);
  });

  test('ignores "store" differences by default', () => {
    const existingComponent = objectBase();
    const incomingComponent = {
      dataElement: 'customButton',
      store: { completely: 'different' },
    };

    const equivalentConfigs = areConfigsEquivalent(existingComponent, incomingComponent);
    expect(equivalentConfigs).toBe(true);
  });

  test('empty arrays equal, arrays with different lengths -> changed', () => {
    const existingComponent = { ...objectBase(), groupedItems: [] };
    const incomingSame = { dataElement: 'customButton', groupedItems: [] };
    const incomingDifferent = { dataElement: 'customButton', groupedItems: ['only-one'] };

    const sameConfigs = areConfigsEquivalent(existingComponent, incomingSame);
    expect(sameConfigs).toBe(true);

    const equivalentConfigs = areConfigsEquivalent(existingComponent, incomingDifferent);
    expect(equivalentConfigs).toBe(false);
  });
});

describe('isPlainObject', () => {
  test('returns true for plain objects and false for arrays/functions/null', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);

    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(() => {})).toBe(false);
  });
});

describe('isEmptyPlainObject', () => {
  test('empty {} is empty', () => {
    expect(isEmptyPlainObject({})).toBe(true);
  });

  test('object with only undefined values counts as empty', () => {
    expect(isEmptyPlainObject({ a: undefined, b: undefined })).toBe(true);
  });

  test('object with any defined value is not empty', () => {
    expect(isEmptyPlainObject({ a: null })).toBe(false);
    expect(isEmptyPlainObject({ a: 0 })).toBe(false);
    expect(isEmptyPlainObject({ a: '' })).toBe(false);
  });

  test('non-objects / arrays are not empty plain objects', () => {
    expect(isEmptyPlainObject([])).toBe(false);
    expect(isEmptyPlainObject(null)).toBe(false);
    expect(isEmptyPlainObject(123)).toBe(false);
  });
});

describe('areArraysShallowEqual', () => {
  test('equal primitive arrays (order-sensitive)', () => {
    expect(areArraysShallowEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(areArraysShallowEqual(['a', 'b'], ['a', 'b'])).toBe(true);
  });

  test('different order -> not equal', () => {
    expect(areArraysShallowEqual([1, 2, 3], [2, 1, 3])).toBe(false);
  });

  test('different length -> not equal', () => {
    expect(areArraysShallowEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  test('arrays with objects: shallow-equal elements compare via areEntriesShallowEqual', () => {
    const a = [{ x: 1 }, { y: 2 }];
    const b = [{ x: 1 }, { y: 2 }];
    expect(areArraysShallowEqual(a, b)).toBe(true);
  });

  test('arrays with functions: functions considered equal (by rule in shallowValueEqual)', () => {
    const a = [() => {}, () => 1];
    const b = [() => {}, () => 2];
    expect(areArraysShallowEqual(a, b)).toBe(true);
  });
});

describe('areEntriesShallowEqual', () => {
  test('identical objects (key order irrelevant)', () => {
    const object1 = { a: 1, b: 'x' };
    const object2 = { b: 'x', a: 1 };
    expect(areEntriesShallowEqual(object1, object2)).toBe(true);
  });

  test('objects differing only by undefined keys are equal', () => {
    const object1 = { a: 1, b: undefined };
    const object2 = { a: 1 };
    expect(areEntriesShallowEqual(object1, object2)).toBe(true);
  });

  test('empty objects are equal; {} equals { a: undefined }', () => {
    expect(areEntriesShallowEqual({}, {})).toBe(true);
    expect(areEntriesShallowEqual({}, { a: undefined })).toBe(true);
  });

  test('value change -> not equal', () => {
    const object1 = { a: 1, b: 2 };
    const object2 = { a: 1, b: 3 };
    expect(areEntriesShallowEqual(object1, object2)).toBe(false);
  });

  test('nested plain objects compare shallowly via shallowValueEqual', () => {
    const object1 = { cfg: { x: 1 } };
    const object2 = { cfg: { x: 1 } };
    expect(areEntriesShallowEqual(object1, object2)).toBe(true);
  });

  test('arrays inside objects are order-sensitive', () => {
    const object1 = { list: ['a', 'b', 'c'] };
    const object2 = { list: ['b', 'a', 'c'] };
    expect(areEntriesShallowEqual(object1, object2)).toBe(false);
  });

  test('functions inside objects considered equal if both are functions', () => {
    const object1 = { onClick: () => {} };
    const object2 = { onClick: () => {} };
    expect(areEntriesShallowEqual(object1, object2)).toBe(true);
  });
});

describe('shallowValueEqual', () => {
  test('primitives: equal by === / Object.is (NaN equals NaN)', () => {
    expect(shallowValueEqual(1, 1)).toBe(true);
    expect(shallowValueEqual('x', 'x')).toBe(true);
    expect(shallowValueEqual(NaN, NaN)).toBe(true);
    expect(shallowValueEqual(1, 2)).toBe(false);
  });

  test('functions: any two functions are considered equal by design', () => {
    const f1 = () => 1;
    const f2 = () => 2;
    expect(shallowValueEqual(f1, f2)).toBe(true);
  });

  test('arrays delegate to areArraysShallowEqual', () => {
    expect(shallowValueEqual([1, 2], [1, 2])).toBe(true);
    expect(shallowValueEqual([1, 2], [2, 1])).toBe(false);
  });

  test('plain objects delegate to areEntriesShallowEqual', () => {
    expect(shallowValueEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(shallowValueEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  test('mixed types are not equal', () => {
    expect(shallowValueEqual(1, '1')).toBe(false);
    expect(shallowValueEqual([], {})).toBe(false);
    expect(shallowValueEqual(null, {})).toBe(false);
  });
});