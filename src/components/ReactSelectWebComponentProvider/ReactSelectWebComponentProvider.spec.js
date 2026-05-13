import React from 'react';
import { act, render } from '@testing-library/react';
import ReactSelectWebComponentProvider from './ReactSelectWebComponentProvider';

let mockCacheCounter = 0;
const mockGetRootNode = jest.fn();

jest.mock('@emotion/cache', () => {
  return jest.fn((options = {}) => ({
    __id: `react-select-cache-${++mockCacheCounter}`,
    sheet: {
      container: options.container,
    },
    options,
  }));
});

jest.mock('@emotion/react', () => ({
  CacheProvider: ({ children, value }) => (
    <div data-testid="cache-provider" data-cache-id={value.__id}>
      {children}
    </div>
  ),
}));

jest.mock('helpers/getRootNode', () => ({
  __esModule: true,
  default: (...args) => mockGetRootNode(...args),
}));

jest.mock('helpers/getCspNonce', () => ({
  __esModule: true,
  default: () => '',
}));

describe('ReactSelectWebComponentProvider reconnect behavior', () => {
  beforeEach(() => {
    mockCacheCounter = 0;
    window.isApryseWebViewerWebComponent = true;
    const host = document.createElement('apryse-webviewer');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    mockGetRootNode.mockReturnValue(shadowRoot);
  });

  afterEach(() => {
    mockGetRootNode.mockReset();
    delete window.isApryseWebViewerWebComponent;
  });

  it('recreates cache on reconnect event', () => {
    const { getByTestId } = render(
      <ReactSelectWebComponentProvider>
        <div>child</div>
      </ReactSelectWebComponentProvider>
    );

    const firstId = getByTestId('cache-provider').getAttribute('data-cache-id');

    act(() => {
      window.dispatchEvent(new CustomEvent('apryse-webcomponent-reconnected'));
    });

    const secondId = getByTestId('cache-provider').getAttribute('data-cache-id');
    expect(secondId).not.toBe(firstId);
  });
});
