/**
 * Defines a deprecated alias on `target` that returns `value` and logs `message`
 * once, on the first access of the alias.
 * @ignore
 * @param {object} target Object to define the alias on.
 * @param {string} name Name of the deprecated alias.
 * @param {*} value Value the alias resolves to.
 * @param {string} message Warning to log.
 */
export default function defineDeprecatedAlias(target, name, value, message) {
  let warned = false;
  Object.defineProperty(target, name, {
    get: function() {
      if (!warned) {
        warned = true;
        console.warn(message);
      }
      return value;
    },
    configurable: true,
  });
}
