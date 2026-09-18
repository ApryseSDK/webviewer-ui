/**
 * Creates an isolated registry for one annotation styling domain.
 * Separate domains should use separate instances so their handlers can compose independently.
 * @ignore
 */
const createAnnotationStyleRegistry = (scopes) => {
  const entriesByScope = new Map(scopes.map((scope) => [scope, new Map()]));

  const getScope = (scope) => entriesByScope.get(scope);

  return {
    register(scope, key, entry) {
      const entries = getScope(scope);
      if (!entries) {
        return false;
      }

      entries.set(key, entry);
      return true;
    },

    unregister(key, scope) {
      if (scope) {
        const entries = getScope(scope);
        return entries ? entries.delete(key) : false;
      }

      let didUnregister = false;
      entriesByScope.forEach((entries) => {
        didUnregister = entries.delete(key) || didUnregister;
      });
      return didUnregister;
    },

    get(scope, key) {
      const entries = getScope(scope);
      return entries ? entries.get(key) : undefined;
    },

    has(scope, key) {
      const entries = getScope(scope);
      return entries ? entries.has(key) : false;
    },

    getApplicable(scope, key, isApplicable) {
      const entry = getScope(scope)?.get(key);
      return entry && isApplicable(entry) ? entry : undefined;
    },
  };
};

export default createAnnotationStyleRegistry;
