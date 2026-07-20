import { getInstanceRect } from './getRootNode';

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
