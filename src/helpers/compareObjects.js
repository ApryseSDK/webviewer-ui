const isPlainObject = (object) => {
  return object != null && typeof object === 'object' && !Array.isArray(object);
};

const isEmptyPlainObject = (object) => {
  if (!isPlainObject(object)) {
    return false;
  }
  for (const key in object) {
    if (Object.hasOwn(object, key) && object[key] !== undefined) {
      return false;
    }
  }
  return true;
};

const areArraysShallowEqual = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (!shallowValueEqual(array1[i], array2[i])) {
      return false;
    }
  }
  return true;
};


const areEntriesShallowEqual = (object1, object2) => {
  if (isEmptyPlainObject(object1) && isEmptyPlainObject(object2)) {
    return true;
  }

  const object1Entries = Object.entries(object1).filter(([, value]) => value !== undefined);
  const object2Entries = Object.entries(object2).filter(([, value]) => value !== undefined);

  if (object1Entries.length !== object2Entries.length) {
    return false;
  }
  const object2Map = new Map(object2Entries);
  for (const [key, value1] of object1Entries) {
    if (!object2Map.has(key)) {
      return false;
    }
    const value2 = object2Map.get(key);
    if (!shallowValueEqual(value1, value2)) {
      return false;
    }
  }
  return true;
};

const shallowValueEqual = (object1, object2) => {
  if (object1 === object2) {
    return true;
  }

  // If both values are functions, returns true without comparing their contents.
  if (typeof object1 === 'function' && typeof object2 === 'function') {
    return true;
  }

  if (Array.isArray(object1) && Array.isArray(object2)) {
    return areArraysShallowEqual(object1, object2);
  }

  if (isPlainObject(object1) && isPlainObject(object2)) {
    return areEntriesShallowEqual(object1, object2);
  }

  return Object.is(object1, object2);
};

/**
 * @ignore
 * Returns true if `incoming` adds new non-ignored keys or changes values
 * compared to `existing`. Ignores: dataElement, items, store, and undefined values in `incoming`.
 */
const hasConfigDiff = (existing, incoming) => {
  const ignoreKeys = ['dataElement', 'items', 'store'];
  const ignore = new Set(ignoreKeys);
  const added = [];
  const changed = [];

  for (const [key, value] of Object.entries(incoming)) {
    if (ignore.has(key)) {
      continue;
    }
    if (value === undefined) {
      continue;
    }

    if (!(key in existing)) {
      added.push(key);
      continue;
    }

    if (!shallowValueEqual(value, existing[key])) {
      changed.push(key);
    }
  }
  return added.length > 0 || changed.length > 0;
};

const areConfigsEquivalent = (existingItem, incomingItem) => {
  return !hasConfigDiff(existingItem, incomingItem);
};

export {
  isPlainObject,
  isEmptyPlainObject,
  areArraysShallowEqual,
  areEntriesShallowEqual,
  shallowValueEqual,
  areConfigsEquivalent,
};