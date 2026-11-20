import defineDeprecatedAlias from 'helpers/defineDeprecatedAlias';

/**
 * Deprecated names on `instance.Core`. To deprecate another name, add an entry here.
 * `getValue` receives `window.Core` and returns what the deprecated name should resolve to.
 * @ignore
 */
export const DEPRECATED_CORE_ALIASES = [
  {
    name: 'ContentBoxEditor',
    getValue: (Core) => Core.ContentEditSession,
    message: 'Core.ContentBoxEditor is deprecated. Use Core.ContentEditSession instead.',
  },
];

/**
 * Defines each deprecated alias on an instance's Core object. Call this after
 * `window.Core` has been spread into `instanceCore`, so the spread itself doesn't
 * trigger the warnings and they only fire when a user reads the alias.
 * @ignore
 * @param {object} instanceCore The instance's Core object.
 * @param {object} [Core] The source Core namespace. Defaults to `window.Core`.
 */
export default function applyDeprecatedCoreAliases(instanceCore, Core = window.Core) {
  DEPRECATED_CORE_ALIASES.forEach(({ name, getValue, message }) => {
    defineDeprecatedAlias(instanceCore, name, getValue(Core), message);
  });
}
