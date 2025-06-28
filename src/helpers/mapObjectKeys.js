/**
 * @ignore
 * Maps over an array of keys and returns an object with the same keys, where each value is the result of the provided callback.
 * @param {Array<string>} keys - The array of keys to map over.
 * @param {function(string): any} fn - The function to apply to each key.
 * @returns {Object} The resulting object.
 */
export default (keys, fn) => {
  return keys.reduce((acc, key) => {
    acc[key] = fn(key);
    return acc;
  }, {});
};