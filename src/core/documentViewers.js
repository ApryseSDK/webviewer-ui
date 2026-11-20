// This module is evaluated once and shared by every WebComponent instance on the page,
// so all mutable state here must be keyed by instance id.

export const DEFAULT_INSTANCE_ID = 1;

// viewerKey is instance-local: 1 = primary, 2 = MultiViewer compare pane.
const viewersByInstance = new Map();

const stateByInstance = new Map();

// Ambient instance: used when a caller passes no instanceId.
let currentInstanceId = DEFAULT_INSTANCE_ID;

const getInstanceViewers = (instanceId) => {
  if (!viewersByInstance.has(instanceId)) {
    viewersByInstance.set(instanceId, new Map());
  }
  return viewersByInstance.get(instanceId);
};

const getInstanceState = (instanceId) => {
  if (!stateByInstance.has(instanceId)) {
    stateByInstance.set(instanceId, { multiViewerMode: false });
  }
  return stateByInstance.get(instanceId);
};

const resolveInstanceId = (instanceId) => instanceId ?? currentInstanceId;

export const getCurrentInstanceId = () => currentInstanceId;

export const setCurrentInstanceId = (instanceId) => {
  currentInstanceId = instanceId ?? DEFAULT_INSTANCE_ID;
};

/**
 * Runs `fn` with `instanceId` as the ambient instance, then restores the previous one.
 * Synchronous only. Prefer `bindToInstance` or an explicit `instanceId` in feature code.
 * @ignore
 */
export const runWithInstance = (instanceId, fn) => {
  const previous = currentInstanceId;
  currentInstanceId = instanceId ?? DEFAULT_INSTANCE_ID;
  try {
    return fn();
  } finally {
    currentInstanceId = previous;
  }
};

/**
 * Wraps `fn` so it always runs against `instanceId`. Use for async continuations and event handlers.
 * @ignore
 */
export const bindToInstance = (instanceId, fn) => {
  if (typeof fn !== 'function' || instanceId == null || fn.__wvInstanceId === instanceId) {
    return fn;
  }
  const wrapped = function boundToInstance(...args) {
    return runWithInstance(instanceId, () => fn.apply(this, args));
  };
  wrapped.__wvInstanceId = instanceId;
  return wrapped;
};

// Lets removeEventListener find the wrapper addEventListener registered.
const boundCallbacks = new WeakMap();

/**
 * Like `bindToInstance`, but returns the same wrapper for the same (instance, fn) pair so it can be removed from an emitter.
 * @ignore
 */
export const getInstanceBoundCallback = (fn, instanceId = currentInstanceId) => {
  if (typeof fn !== 'function' || fn.__wvInstanceId != null) {
    return fn;
  }
  if (!boundCallbacks.has(fn)) {
    boundCallbacks.set(fn, new Map());
  }
  const byInstance = boundCallbacks.get(fn);
  if (!byInstance.has(instanceId)) {
    byInstance.set(instanceId, bindToInstance(instanceId, fn));
  }
  return byInstance.get(instanceId);
};

export const findInstanceBoundCallback = (fn, instanceId = currentInstanceId) => boundCallbacks.get(fn)?.get(instanceId);

// Classes (native or transpiled) have prototype methods or a parent;
// plain functions and factories don't.
const isClass = (fn) => {
  if (/^class[\s{]/.test(Function.prototype.toString.call(fn))) {
    return true;
  }
  const { prototype } = fn;
  return !!prototype && (Object.getOwnPropertyNames(prototype).length > 1 || Object.getPrototypeOf(prototype) !== Object.prototype);
};

// Plain and `Object.create(literal)` objects (e.g. UI.TabManager);
// excludes class instances such as i18next.
const isApiObject = (value) => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype || proto.constructor === Object;
};

const getApiMethodNames = (api) => {
  const names = new Set(Object.keys(api));
  let proto = Object.getPrototypeOf(api);
  while (proto && proto !== Object.prototype) {
    Object.getOwnPropertyNames(proto).forEach((name) => typeof proto[name] === 'function' && names.add(name));
    proto = Object.getPrototypeOf(proto);
  }
  return names;
};

/**
 * Recursively binds the functions of an API namespace (e.g. `instance.UI`) to `instanceId`.
 * Classes are left unbound so `instanceof`, subclassing and statics keep working.
 * @ignore
 */
export const bindApiToInstance = (api, instanceId, seen = new WeakMap()) => {
  if (!isApiObject(api)) {
    return api;
  }
  if (seen.has(api)) {
    return seen.get(api);
  }
  const bound = {};
  seen.set(api, bound);
  getApiMethodNames(api).forEach((name) => {
    const value = api[name];
    if (typeof value === 'function' && !isClass(value)) {
      const boundApiMethod = function(...args) {
        const newTarget = new.target === boundApiMethod ? value : new.target;
        if (newTarget) {
          return runWithInstance(instanceId, () => Reflect.construct(value, args, newTarget));
        }
        const thisArg = this === bound ? api : this;
        return runWithInstance(instanceId, () => value.apply(thisArg, args));
      };
      bound[name] = boundApiMethod;
    } else {
      bound[name] = bindApiToInstance(value, instanceId, seen);
    }
  });
  return bound;
};

/**
 * Per-instance replacement for module-level state.
 * `get()` defaults to the ambient instance; `unregisterInstance` drops an instance's state.
 * @ignore
 */
const scopedStates = new Set();

export const createInstanceScopedState = (createInitialState) => {
  const stateById = new Map();
  const scoped = {
    get(instanceId = currentInstanceId) {
      if (!stateById.has(instanceId)) {
        stateById.set(instanceId, createInitialState(instanceId));
      }
      return stateById.get(instanceId);
    },
    delete(instanceId) {
      stateById.delete(instanceId);
    },
    clear() {
      stateById.clear();
    },
  };
  scopedStates.add(scoped);
  return scoped;
};

export const registerInstance = (instanceId) => {
  getInstanceViewers(instanceId);
  getInstanceState(instanceId);
  currentInstanceId = instanceId;
};

export const unregisterInstance = (instanceId) => {
  viewersByInstance.delete(instanceId);
  stateByInstance.delete(instanceId);
  scopedStates.forEach((scoped) => scoped.delete(instanceId));
  if (currentInstanceId === instanceId) {
    const [fallback] = viewersByInstance.keys();
    currentInstanceId = fallback ?? DEFAULT_INSTANCE_ID;
  }
};

export const resetInstances = () => {
  viewersByInstance.clear();
  stateByInstance.clear();
  scopedStates.forEach((scoped) => scoped.clear());
  currentInstanceId = DEFAULT_INSTANCE_ID;
};

export const setMultiViewerModeActive = (active, instanceId) => {
  getInstanceState(resolveInstanceId(instanceId)).multiViewerMode = !!active;
};

export const getMultiViewerModeActive = (instanceId) => getInstanceState(resolveInstanceId(instanceId)).multiViewerMode;

export const setDocumentViewer = (viewerKey, documentViewer, instanceId) => {
  getInstanceViewers(resolveInstanceId(instanceId)).set(viewerKey, documentViewer);
  return documentViewer;
};

export const deleteDocumentViewer = (viewerKey, instanceId) => {
  getInstanceViewers(resolveInstanceId(instanceId)).delete(viewerKey);
};

// Deep, callable no-op returned during teardown when a DocumentViewer has already been removed.
const NULL_VIEWER_TARGET = function nullViewerTarget() { /* unreachable: see Proxy `apply` trap */ };
const NULL_VIEWER = new Proxy(NULL_VIEWER_TARGET, {
  get(_target, prop) {
    if (prop === 'then' || prop === Symbol.iterator) {
      return undefined;
    }
    if (prop === Symbol.toPrimitive) {
      return () => '';
    }
    if (prop === 'toString' || prop === 'valueOf') {
      return () => '';
    }
    if (prop === Symbol.toStringTag) {
      return 'NullDocumentViewer';
    }
    if (prop === 'name' || prop === 'displayName') {
      return '';
    }
    return NULL_VIEWER;
  },
  apply() {
    return NULL_VIEWER;
  },
});

export const hasDocumentViewer = (viewerKey, instanceId) => getInstanceViewers(resolveInstanceId(instanceId)).has(viewerKey ?? 1);

export const getDocumentViewer = (viewerKey, instanceId) => getInstanceViewers(resolveInstanceId(instanceId)).get(viewerKey ?? 1) || NULL_VIEWER;

/**
 * All DocumentViewers owned by a single instance: the primary plus the MultiViewer compare
 * pane when it exists. Never crosses instance boundaries.
 * @ignore
 */
export const getDocumentViewers = (instanceId) => Array.from(getInstanceViewers(resolveInstanceId(instanceId)).values());