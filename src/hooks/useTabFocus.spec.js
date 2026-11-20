import { renderHook } from '@testing-library/react-hooks';
import useTabFocus from './useTabFocus';
import core from 'core';
import getRootNode from 'helpers/getRootNode';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => 1),
}));

jest.mock('core', () => ({
  __esModule: true,
  default: {
    getDocumentViewer: jest.fn(),
  },
}));

jest.mock('helpers/getRootNode', () => jest.fn());

describe('useTabFocus', () => {
  let host;
  let shadowRoot;

  beforeEach(() => {
    host = document.createElement('div');
    shadowRoot = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);
    getRootNode.mockReturnValue(shadowRoot);
  });

  afterEach(() => {
    document.body.removeChild(host);
    jest.clearAllMocks();
  });

  it('does not prevent Tab from leaving a page in a Web Component', () => {
    const viewerElement = document.createElement('div');
    const pageContainer = document.createElement('div');
    const pageControl = document.createElement('button');
    const pageText = document.createElement('div');
    pageContainer.id = 'pageContainer1';
    pageText.id = 'pageText1';
    pageText.tabIndex = 0;
    pageControl.style.position = 'fixed';
    pageText.style.position = 'fixed';
    pageContainer.append(pageControl, pageText);
    viewerElement.appendChild(pageContainer);
    shadowRoot.appendChild(viewerElement);

    core.getDocumentViewer.mockReturnValue({
      getViewerElement: () => viewerElement,
      getDisplayModeManager: () => ({
        getDisplayMode: () => ({ getVisiblePages: () => [1] }),
      }),
    });

    pageControl.focus();
    const pageTextFocusSpy = jest.spyOn(pageText, 'focus');
    renderHook(() => useTabFocus());

    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    window.dispatchEvent(event);

    expect(document.activeElement).toBe(host);
    expect(event.defaultPrevented).toBe(false);
    expect(pageTextFocusSpy).not.toHaveBeenCalled();
  });
});