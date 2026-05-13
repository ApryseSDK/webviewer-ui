import { getInstanceNode } from 'helpers/getRootNode';
import getCspNonce from 'helpers/getCspNonce';

jest.mock('helpers/getRootNode', () => ({
  getInstanceNode: jest.fn(),
}));

describe('getCspNonce', () => {
  let originalParentDescriptor;
  let originalFrameElementDescriptor;
  let hadOwnParent;
  let hadOwnFrameElement;

  beforeEach(() => {
    hadOwnParent = Object.prototype.hasOwnProperty.call(window, 'parent');
    hadOwnFrameElement = Object.prototype.hasOwnProperty.call(window, 'frameElement');
    originalParentDescriptor = Object.getOwnPropertyDescriptor(window, 'parent');
    originalFrameElementDescriptor = Object.getOwnPropertyDescriptor(window, 'frameElement');
    getInstanceNode.mockReset();
  });

  afterEach(() => {
    if (hadOwnParent && originalParentDescriptor) {
      Object.defineProperty(window, 'parent', originalParentDescriptor);
    } else {
      delete window.parent;
    }
    if (hadOwnFrameElement && originalFrameElementDescriptor) {
      Object.defineProperty(window, 'frameElement', originalFrameElementDescriptor);
    } else {
      delete window.frameElement;
    }
    window.isApryseWebViewerWebComponent = false;
  });

  it('returns cspNonce from instance node in web component mode', () => {
    window.isApryseWebViewerWebComponent = true;
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn((name) => (name === 'cspNonce' ? 'wc-nonce' : null)),
    });

    expect(getCspNonce()).toBe('wc-nonce');
  });

  it('returns data-csp-nonce from frameElement in iframe mode', () => {
    window.isApryseWebViewerWebComponent = false;
    Object.defineProperty(window, 'parent', { configurable: true, value: {} });
    Object.defineProperty(window, 'frameElement', {
      configurable: true,
      value: {
        getAttribute: jest.fn((name) => (name === 'data-csp-nonce' ? 'iframe-nonce' : null)),
      },
    });

    expect(getCspNonce()).toBe('iframe-nonce');
  });

  it('returns empty string in top window mode', () => {
    window.isApryseWebViewerWebComponent = false;
    Object.defineProperty(window, 'parent', { configurable: true, value: window });

    expect(getCspNonce()).toBe('');
  });

  it('returns empty string when frameElement access throws', () => {
    window.isApryseWebViewerWebComponent = false;
    Object.defineProperty(window, 'parent', { configurable: true, value: {} });
    Object.defineProperty(window, 'frameElement', {
      configurable: true,
      get() {
        throw new Error('cross-origin');
      },
    });

    expect(getCspNonce()).toBe('');
  });
});
