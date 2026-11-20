import getRootNode, {
  getInstanceNode,
  getInstanceRect,
  getSpreadsheetEditorRoot,
  isEventWithinElement,
  releaseRootNode,
  resetRootNode,
  runWithStartingRootNode,
  setInstanceRootNode,
  setRootNode,
} from './getRootNode';
import { registerInstance, resetInstances, runWithInstance } from 'core/documentViewers';

describe('getInstanceRect', () => {
  const FALLBACK_RECT = { left: 0, right: 1024 };

  let originalIsWebComponent;
  let originalDocElementGetRect;

  beforeEach(() => {
    originalIsWebComponent = window.isApryseWebViewerWebComponent;
    // Not a web component -> getWebViewerRect resolves to the document element rect.
    window.isApryseWebViewerWebComponent = false;
    originalDocElementGetRect = document.documentElement.getBoundingClientRect;
    document.documentElement.getBoundingClientRect = jest.fn(() => FALLBACK_RECT);
  });

  afterEach(() => {
    window.isApryseWebViewerWebComponent = originalIsWebComponent;
    document.documentElement.getBoundingClientRect = originalDocElementGetRect;
    jest.restoreAllMocks();
  });

  it('returns the shadow host rect when the element is inside a shadow root', () => {
    const hostRect = { left: 50, right: 600 };
    const host = { getBoundingClientRect: jest.fn(() => hostRect) };
    const element = { getRootNode: jest.fn(() => ({ host })) };

    expect(getInstanceRect(element)).toBe(hostRect);
  });

  it('falls back to the global WebViewer rect when the root has no host', () => {
    const element = { getRootNode: jest.fn(() => ({ host: null })) };

    expect(getInstanceRect(element)).toBe(FALLBACK_RECT);
  });

  it('falls back to the global WebViewer rect when the element has no getRootNode', () => {
    const element = {};

    expect(getInstanceRect(element)).toBe(FALLBACK_RECT);
  });

  it('falls back to the global WebViewer rect when no element is provided', () => {
    expect(getInstanceRect(undefined)).toBe(FALLBACK_RECT);
  });
});

describe('root node resolution with two Web Component instances', () => {
  const createShadowRoot = () => {
    const host = document.createElement('apryse-webviewer');
    document.body.appendChild(host);
    return host.attachShadow({ mode: 'open' });
  };

  beforeEach(() => {
    window.isApryseWebViewerWebComponent = true;
    registerInstance(1);
    registerInstance(2);
  });

  afterEach(() => {
    delete window.isApryseWebViewerWebComponent;
    resetRootNode();
    resetInstances();
    document.body.innerHTML = '';
  });

  it('should resolve each instance\'s own shadow root and host regardless of mount order', () => {
    const firstRoot = createShadowRoot();
    const secondRoot = createShadowRoot();
    setInstanceRootNode(1, firstRoot);
    setInstanceRootNode(2, secondRoot);
    setRootNode(secondRoot);

    expect(runWithInstance(1, getRootNode)).toBe(firstRoot);
    expect(runWithInstance(1, getInstanceNode)).toBe(firstRoot.host);
    expect(runWithInstance(2, getRootNode)).toBe(secondRoot);
    expect(runWithInstance(2, getInstanceNode)).toBe(secondRoot.host);
  });

  it('should resolve the starting instance root while a sibling is still ambient', () => {
    const firstRoot = createShadowRoot();
    const secondRoot = createShadowRoot();
    setInstanceRootNode(1, firstRoot);
    setRootNode(secondRoot);

    expect(runWithInstance(1, getRootNode)).toBe(firstRoot);
    expect(runWithInstance(1, () => runWithStartingRootNode(secondRoot, getRootNode))).toBe(secondRoot);
    expect(runWithInstance(1, getRootNode)).toBe(firstRoot);
  });
});

describe('isEventWithinElement', () => {
  let container;

  const clickAndCheck = (target, element = container) => {
    let result;
    window.addEventListener('click', (e) => {
      result = isEventWithinElement(e, element);
    }, { once: true });
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    return result;
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return true for an event from a descendant of the element', () => {
    const child = document.createElement('span');
    container.appendChild(child);

    expect(clickAndCheck(child)).toBe(true);
  });

  it('should return true when both the element and the event are inside a shadow root, where the target is retargeted to the host', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadowElement = document.createElement('div');
    const inner = document.createElement('button');
    shadowElement.appendChild(inner);
    host.attachShadow({ mode: 'open' }).appendChild(shadowElement);
    let retargetedToHost = false;
    window.addEventListener('click', (e) => {
      retargetedToHost = e.target === host;
    }, { once: true });

    expect(clickAndCheck(inner, shadowElement)).toBe(true);
    expect(retargetedToHost).toBe(true);
  });

  it('should return false for an event from outside the element', () => {
    const outside = document.createElement('div');
    document.body.appendChild(outside);

    expect(clickAndCheck(outside)).toBe(false);
  });

  it('should return false when there is no element to compare against', () => {
    expect(clickAndCheck(container, null)).toBe(false);
  });
});

describe('getSpreadsheetEditorRoot', () => {
  let originalIsWebComponent;

  beforeEach(() => {
    originalIsWebComponent = window.isApryseWebViewerWebComponent;
  });

  afterEach(() => {
    resetRootNode();
    window.isApryseWebViewerWebComponent = originalIsWebComponent;
    document.body.innerHTML = '';
  });

  it('should return the document when the editor is not in its own shadow root', () => {
    window.isApryseWebViewerWebComponent = false;

    expect(getSpreadsheetEditorRoot() === document).toBe(true);
  });

  it('should return the editor shadow root in web component mode', () => {
    window.isApryseWebViewerWebComponent = true;
    const appRoot = document.createElement('div').attachShadow({ mode: 'open' });
    const editorHost = document.createElement('ltleadsheet-element');
    const editorShadowRoot = editorHost.attachShadow({ mode: 'open' });
    appRoot.appendChild(editorHost);
    setRootNode(appRoot);

    // Compared as a boolean because Jest cannot reliably print a diff of a shadow root when the assertion fails.
    expect(getSpreadsheetEditorRoot() === editorShadowRoot).toBe(true);
  });

  it('should return the WebViewer root in web component mode when the editor has no shadow root', () => {
    window.isApryseWebViewerWebComponent = true;
    const appRoot = document.createElement('div').attachShadow({ mode: 'open' });
    setRootNode(appRoot);

    expect(getSpreadsheetEditorRoot() === appRoot).toBe(true);
  });
});

describe('releaseRootNode', () => {
  let originalIsWebComponent;

  beforeEach(() => {
    originalIsWebComponent = window.isApryseWebViewerWebComponent;
    window.isApryseWebViewerWebComponent = true;
  });

  afterEach(() => {
    resetRootNode();
    window.isApryseWebViewerWebComponent = originalIsWebComponent;
  });

  it('should stop returning a destroyed instance root', () => {
    const destroyedRoot = document.createElement('div').attachShadow({ mode: 'open' });
    setRootNode(destroyedRoot);

    releaseRootNode(destroyedRoot);

    expect(getRootNode()).not.toBe(destroyedRoot);
  });

  it('should keep the current root when a different instance is released', () => {
    const currentRoot = document.createElement('div').attachShadow({ mode: 'open' });
    const destroyedRoot = document.createElement('div').attachShadow({ mode: 'open' });
    setRootNode(currentRoot);

    releaseRootNode(destroyedRoot);

    expect(getRootNode()).toBe(currentRoot);
  });
});
