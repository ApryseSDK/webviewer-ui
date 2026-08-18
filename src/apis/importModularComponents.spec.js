const createMockActions = () => ({
  resetModularUIState: jest.fn(() => ({ type: 'RESET_MODULAR_UI_STATE' })),
  setModularComponentFunctions: jest.fn((functionMap) => ({ type: 'SET_MODULAR_COMPONENT_FUNCTIONS', payload: { functionMap } })),
  enableElements: jest.fn((dataElements, priority) => ({ type: 'ENABLE_ELEMENTS', payload: { dataElements, priority } })),
  disableElements: jest.fn((dataElements, priority) => ({ type: 'DISABLE_ELEMENTS', payload: { dataElements, priority } })),
  setPopupItems: jest.fn((dataElement, items) => ({ type: 'SET_POPUP_ITEMS', payload: { dataElement, items } })),
  setModularHeadersAndComponents: jest.fn((headers, components) => ({ type: 'SET_MODULAR_HEADERS_AND_COMPONENTS', payload: { headers, components } })),
  setFlyouts: jest.fn((flyouts) => ({ type: 'SET_FLYOUTS', payload: { flyouts } })),
  addFlyout: jest.fn((flyout) => ({ type: 'ADD_FLYOUT', payload: { flyout } })),
});

const createTypes = () => ({
  OBJECT: jest.fn(() => ({})),
  ONE_OF: jest.fn(() => ({})),
  MULTI_TYPE: jest.fn(() => ({})),
  OPTIONAL: jest.fn(() => ({})),
  ARRAY: jest.fn(() => ({})),
  STRING: jest.fn(() => ({})),
  FUNCTION: jest.fn(() => ({})),
});

const createStore = (disabledElements) => ({
  dispatch: jest.fn(),
  getState: jest.fn(() => ({
    viewer: {
      disabledElements,
      modularComponentFunctions: {},
      flyoutMap: {},
    },
  })),
});

const getMinimalConfig = (componentDefinitions) => ({
  modularComponents: componentDefinitions.reduce((acc, componentDef) => {
    if (typeof componentDef === 'string') {
      acc[componentDef] = { type: 'divider' };
      return acc;
    }

    acc[componentDef.key] = {
      type: 'divider',
      ...(componentDef.disabled !== undefined ? { disabled: componentDef.disabled } : {}),
    };
    return acc;
  }, {}),
  modularHeaders: {},
  panels: {},
  flyouts: {},
  popups: {},
});

let previousCore;

const loadImportModularComponents = () => {
  jest.resetModules();

  const actionsMock = createMockActions();
  const setPanelsMock = jest.fn(() => jest.fn());
  const selectorsMock = { getFlyout: jest.fn(() => undefined) };
  const fireEventMock = jest.fn();

  jest.doMock('actions', () => actionsMock);
  jest.doMock('./setPanels', () => setPanelsMock);
  jest.doMock('selectors', () => selectorsMock);
  jest.doMock('helpers/fireEvent', () => fireEventMock);

  globalThis.Core = {
    checkTypes: jest.fn(),
    TYPES: createTypes(),
  };

  // eslint-disable-next-line global-require
  const importModularComponents = require('./importModularComponents').default;

  return {
    importModularComponents,
    actionsMock,
  };
};

describe('importModularComponents API', () => {
  beforeEach(() => {
    previousCore = globalThis.Core;
  });

  afterEach(() => {
    if (typeof previousCore === 'undefined') {
      delete globalThis.Core;
      return;
    }

    globalThis.Core = previousCore;
  });

  it('re-enables elements explicitly set to disabled false regardless of existing disabled priority', async () => {
    const { importModularComponents, actionsMock } = loadImportModularComponents();

    const store = createStore({
      shouldStayDisabled: { disabled: true, priority: 2 },
      shouldBeEnabled: { disabled: true, priority: 2 },
    });

    await importModularComponents(store)(
      getMinimalConfig([
        { key: 'shouldStayDisabled' },
        { key: 'shouldBeEnabled', disabled: false },
      ]),
      {}
    );

    expect(actionsMock.enableElements).toHaveBeenCalledWith(['shouldBeEnabled'], 3);
    expect(actionsMock.disableElements).toHaveBeenCalledWith([], 3);
  });

  it('disables elements explicitly set to disabled true at import priority', async () => {
    const { importModularComponents, actionsMock } = loadImportModularComponents();

    const store = createStore({});

    await importModularComponents(store)(
      getMinimalConfig([{ key: 'shouldBeDisabled', disabled: true }]),
      {}
    );

    expect(actionsMock.enableElements).toHaveBeenCalledWith([], 3);
    expect(actionsMock.disableElements).toHaveBeenCalledWith(['shouldBeDisabled'], 3);
  });

  it('does not re-enable elements when disabled is omitted from imported config', async () => {
    const { importModularComponents, actionsMock } = loadImportModularComponents();

    const store = createStore({
      omittedDisabledFlag: { disabled: true, priority: 3 },
    });

    await importModularComponents(store)(
      getMinimalConfig([{ key: 'omittedDisabledFlag' }]),
      {}
    );

    expect(actionsMock.enableElements).toHaveBeenCalledWith([], 3);
  });

  it('clears internal enabled-element tracking between consecutive imports', async () => {
    const { importModularComponents, actionsMock } = loadImportModularComponents();

    const store = createStore({
      firstImportOnly: { disabled: true, priority: 3 },
      secondImportOnly: { disabled: true, priority: 3 },
    });

    await importModularComponents(store)(getMinimalConfig([{ key: 'firstImportOnly', disabled: false }]), {});
    expect(actionsMock.enableElements).toHaveBeenLastCalledWith(['firstImportOnly'], 3);

    await importModularComponents(store)(getMinimalConfig([{ key: 'secondImportOnly', disabled: false }]), {});
    expect(actionsMock.enableElements).toHaveBeenLastCalledWith(['secondImportOnly'], 3);
  });
});
