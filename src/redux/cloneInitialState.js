const isPlainObject = (value) => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * @ignore
 * Copies the plain objects, arrays, Sets and Maps in a state tree so each store owns its containers. Anything else
 * (functions, class instances, React elements, DOM nodes) is kept by reference.
 */
const cloneInitialState = (value) => {
  if (Array.isArray(value)) {
    return value.map(cloneInitialState);
  }
  if (value instanceof Set) {
    return new Set(Array.from(value, cloneInitialState));
  }
  if (value instanceof Map) {
    return new Map(Array.from(value, ([key, entry]) => [key, cloneInitialState(entry)]));
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneInitialState(entry)]));
  }
  return value;
};

export default cloneInitialState;
