import {
  setDocumentViewer,
  deleteDocumentViewer,
  getDocumentViewers,
  getDocumentViewer,
  hasDocumentViewer,
  registerInstance,
  unregisterInstance,
  setCurrentInstanceId,
  getCurrentInstanceId,
  setMultiViewerModeActive,
  getMultiViewerModeActive,
  runWithInstance,
  bindToInstance,
  bindApiToInstance,
  createInstanceScopedState,
  resetInstances,
} from './documentViewers';

const registerTwoInstancesWithPrimaryViewers = () => {
  registerInstance(1);
  registerInstance(2);
  const viewerA = { id: 'a' };
  const viewerB = { id: 'b' };
  setDocumentViewer(1, viewerA, 1);
  setDocumentViewer(1, viewerB, 2);
  return { viewerA, viewerB };
};

afterEach(() => {
  resetInstances();
});

describe('document viewer registry', () => {
  it('should return only the viewers owned by the requested instance', () => {
    const { viewerA, viewerB } = registerTwoInstancesWithPrimaryViewers();

    expect(getDocumentViewers(1)).toEqual([viewerA]);
    expect(getDocumentViewers(2)).toEqual([viewerB]);
    expect(getDocumentViewer(1, 1)).toBe(viewerA);
    expect(getDocumentViewer(1, 2)).toBe(viewerB);
  });

  it('should resolve the ambient instance when no instance is passed', () => {
    const { viewerA, viewerB } = registerTwoInstancesWithPrimaryViewers();

    setCurrentInstanceId(1);
    expect(getDocumentViewer()).toBe(viewerA);

    setCurrentInstanceId(2);
    expect(getDocumentViewer()).toBe(viewerB);
    expect(getDocumentViewers()).toEqual([viewerB]);
  });

  it('should keep the MultiViewer compare pane inside its own instance', () => {
    const { viewerA, viewerB } = registerTwoInstancesWithPrimaryViewers();
    const compareViewer = { id: 'a-compare' };
    setDocumentViewer(2, compareViewer, 1);
    setMultiViewerModeActive(true, 1);

    expect(getDocumentViewers(1)).toEqual([viewerA, compareViewer]);
    expect(getDocumentViewers(2)).toEqual([viewerB]);
    expect(hasDocumentViewer(2, 2)).toBe(false);
    expect(getMultiViewerModeActive(1)).toBe(true);
    expect(getMultiViewerModeActive(2)).toBe(false);
  });

  it('should leave the same key in another instance when deleting a viewer in one instance', () => {
    const { viewerB } = registerTwoInstancesWithPrimaryViewers();

    deleteDocumentViewer(1, 1);

    expect(getDocumentViewers(1)).toEqual([]);
    expect(getDocumentViewer(1, 2)).toBe(viewerB);
  });

  it('should keep the other instance usable and make it ambient when unregistering an instance', () => {
    const { viewerB } = registerTwoInstancesWithPrimaryViewers();
    setCurrentInstanceId(1);

    unregisterInstance(1);

    expect(getDocumentViewers(1)).toEqual([]);
    expect(getCurrentInstanceId()).toBe(2);
    expect(getDocumentViewer()).toBe(viewerB);
  });

  it('should return a callable no-op when the requested viewer does not exist', () => {
    registerInstance(1);
    const viewer = getDocumentViewer(1, 1);
    expect(viewer()).toBe(viewer);
    expect(viewer.getAnnotationManager().getAnnotationsList()).toBe(viewer);
  });
});

describe('instance binding', () => {
  it('should run a deferred callback bound with bindToInstance against its bound instance', async () => {
    const { viewerA } = registerTwoInstancesWithPrimaryViewers();
    setCurrentInstanceId(1);
    const deferred = bindToInstance(1, () => getDocumentViewer());

    setCurrentInstanceId(2);
    await Promise.resolve();

    expect(deferred()).toBe(viewerA);
    expect(getCurrentInstanceId()).toBe(2);
  });

  it('should restore the previous instance in runWithInstance even when the callback throws', () => {
    setCurrentInstanceId(2);
    expect(() => runWithInstance(1, () => {
      throw new Error('boom');
    })).toThrow('boom');
    expect(getCurrentInstanceId()).toBe(2);
  });

  it('should resolve API calls bound with bindApiToInstance against the owning instance', () => {
    const { viewerA, viewerB } = registerTwoInstancesWithPrimaryViewers();
    const api = {
      getViewer: () => getDocumentViewer(),
      Nested: { getViewer: () => getDocumentViewer() },
    };
    const apiA = bindApiToInstance(api, 1);
    const apiB = bindApiToInstance(api, 2);

    setCurrentInstanceId(2);
    expect(apiA.getViewer()).toBe(viewerA);
    expect(apiA.Nested.getViewer()).toBe(viewerA);

    setCurrentInstanceId(1);
    expect(apiB.getViewer()).toBe(viewerB);
  });

  it('should bind prototype methods of API objects with bindApiToInstance and preserve their `this`', () => {
    const { viewerA } = registerTwoInstancesWithPrimaryViewers();
    const TabManagerAPI = {
      initialize(label) {
        this.label = label;
        return this;
      },
      describe() {
        return { label: this.label, viewer: getDocumentViewer() };
      },
    };
    const bound = bindApiToInstance({ TabManager: Object.create(TabManagerAPI).initialize('tabs') }, 1);

    setCurrentInstanceId(2);
    expect(bound.TabManager.describe()).toEqual({ label: 'tabs', viewer: viewerA });
  });

  it('should leave classes and non-plain objects untouched in bindApiToInstance', () => {
    class Item {
      getType() {
        return 'item';
      }
    }
    class I18n {
      t() {
        return '';
      }
    }
    const i18n = new I18n();
    const api = { Item, i18n, Events: { READY: 'ready' } };

    const bound = bindApiToInstance(api, 1);

    expect(bound.Item).toBe(Item);
    expect(new bound.Item()).toBeInstanceOf(Item);
    expect(bound.i18n).toBe(i18n);
    expect(bound.Events).toEqual({ READY: 'ready' });
  });

  it('should keep factory functions constructible with `new` in bindApiToInstance', () => {
    registerTwoInstancesWithPrimaryViewers();
    function CustomButton(props) {
      this.props = props;
      this.instanceId = getCurrentInstanceId();
    }
    const bound = bindApiToInstance({ CustomButton }, 1);

    setCurrentInstanceId(2);
    const button = new bound.CustomButton({ label: 'x' });

    expect(button).toBeInstanceOf(CustomButton);
    expect(button).toEqual(expect.objectContaining({ props: { label: 'x' }, instanceId: 1 }));
  });

  it('should pass arguments, return values and thrown errors through bound API methods', () => {
    registerTwoInstancesWithPrimaryViewers();
    const failure = new Error('boom');
    const api = {
      add: (a, b) => a + b,
      fail: () => {
        throw failure;
      },
    };
    const bound = bindApiToInstance(api, 1);

    expect(bound.add(2, 3)).toBe(5);
    expect(() => bound.fail()).toThrow(failure);
  });

  it('should keep the owning instance current for the duration of a bound API call and restore it afterwards', () => {
    registerTwoInstancesWithPrimaryViewers();
    const bound = bindApiToInstance({ whoAmI: () => getCurrentInstanceId() }, 1);

    setCurrentInstanceId(2);

    expect(bound.whoAmI()).toBe(1);
    expect(getCurrentInstanceId()).toBe(2);
  });

  it('should copy non-function values through bindApiToInstance unchanged', () => {
    const list = [1, 2];
    const bound = bindApiToInstance({ name: 'ui', count: 3, enabled: false, nothing: null, list }, 1);

    expect(bound).toEqual({ name: 'ui', count: 3, enabled: false, nothing: null, list });
    expect(bound.list).toBe(list);
  });

  it('should bind a shared or self-referencing API object once without recursing forever', () => {
    registerTwoInstancesWithPrimaryViewers();
    const shared = { getViewer: () => getDocumentViewer() };
    const api = { first: shared, second: shared };
    api.self = api;

    const bound = bindApiToInstance(api, 1);
    setCurrentInstanceId(2);

    expect(bound.first).toBe(bound.second);
    expect(bound.self).toBe(bound);
    expect(bound.self.first.getViewer()).toBe(bound.first.getViewer());
    expect(bound.first.getViewer()).toEqual({ id: 'a' });
  });

  it('should leave native class declarations untouched in bindApiToInstance', () => {
    // Built at runtime so the class keyword survives the test transform. It is empty on purpose: with no methods or parent, only its source text identifies it as a class.
    const NativeItem = new Function('return class NativeItem {}')();

    const bound = bindApiToInstance({ NativeItem }, 1);

    expect(bound.NativeItem).toBe(NativeItem);
    expect(new bound.NativeItem()).toBeInstanceOf(NativeItem);
  });

  it('should allow subclassing a bound factory and construct the subclass against the owning instance', () => {
    registerTwoInstancesWithPrimaryViewers();
    function Base() {
      this.instanceId = getCurrentInstanceId();
    }
    const bound = bindApiToInstance({ Base }, 1);
    class Derived extends bound.Base {}

    setCurrentInstanceId(2);
    const derived = new Derived();

    expect(derived).toBeInstanceOf(Derived);
    expect(derived.instanceId).toBe(1);
  });
});

describe('createInstanceScopedState', () => {
  it('should keep separate state per instance and drop it when the instance is unregistered', () => {
    registerInstance(1);
    registerInstance(2);
    const scoped = createInstanceScopedState(() => ({ listeners: [] }));

    scoped.get(1).listeners.push('a');

    expect(scoped.get(2).listeners).toEqual([]);
    unregisterInstance(1);
    expect(scoped.get(1).listeners).toEqual([]);
  });
});
