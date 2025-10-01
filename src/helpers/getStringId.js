let currentId = 0;

/**
 * Generates a sequential string to use as a unique identifier. This should be
 * used over `getId` if you need to use it as a DOM id, or a React key.
 *
 * @param prefix Optional. Prefix for the string id.
 */
const getStringId = (prefix = 'id') => {
  return `${prefix}_${(currentId++).toString(16)}`;
};

export default getStringId;