import React from 'react';
import { act, render, within } from '@testing-library/react';
import ReactSelectWebComponentProvider from './ReactSelectWebComponentProvider';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';

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

describe('ReactSelectWebComponentProvider multi-instance behavior', () => {
  beforeEach(() => {
    mockCacheCounter = 0;
    window.isApryseWebViewerWebComponent = true;
  });

  afterEach(() => {
    mockGetRootNode.mockReset();
    delete window.isApryseWebViewerWebComponent;
  });

  it('uses each instance\'s own root from context', () => {
    const host1 = document.createElement('apryse-webviewer');
    const shadowRoot1 = host1.attachShadow({ mode: 'open' });
    const host2 = document.createElement('apryse-webviewer');
    const shadowRoot2 = host2.attachShadow({ mode: 'open' });

    const { container: container1 } = render(
      <InstanceRootNodeContext.Provider value={shadowRoot1}>
        <ReactSelectWebComponentProvider>
          <div>instance 1</div>
        </ReactSelectWebComponentProvider>
      </InstanceRootNodeContext.Provider>
    );
    const { container: container2 } = render(
      <InstanceRootNodeContext.Provider value={shadowRoot2}>
        <ReactSelectWebComponentProvider>
          <div>instance 2</div>
        </ReactSelectWebComponentProvider>
      </InstanceRootNodeContext.Provider>
    );

    const cacheId1 = within(container1).getByTestId('cache-provider').getAttribute('data-cache-id');
    const cacheId2 = within(container2).getByTestId('cache-provider').getAttribute('data-cache-id');

    expect(cacheId1).not.toBe(cacheId2);
  });

  it('ignores reconnect events targeting a different instance host', () => {
    const host1 = document.createElement('apryse-webviewer');
    const shadowRoot1 = host1.attachShadow({ mode: 'open' });
    const host2 = document.createElement('apryse-webviewer');

    const { getByTestId } = render(
      <InstanceRootNodeContext.Provider value={shadowRoot1}>
        <ReactSelectWebComponentProvider>
          <div>child</div>
        </ReactSelectWebComponentProvider>
      </InstanceRootNodeContext.Provider>
    );

    const firstId = getByTestId('cache-provider').getAttribute('data-cache-id');

    act(() => {
      window.dispatchEvent(new CustomEvent('apryse-webcomponent-reconnected', { detail: { host: host2 } }));
    });

    expect(getByTestId('cache-provider').getAttribute('data-cache-id')).toBe(firstId);

    act(() => {
      window.dispatchEvent(new CustomEvent('apryse-webcomponent-reconnected', { detail: { host: host1 } }));
    });

    expect(getByTestId('cache-provider').getAttribute('data-cache-id')).not.toBe(firstId);
  });

  it('handles reconnect events when the instance root is a document', () => {
    const host = document.createElement('apryse-webviewer');

    const { getByTestId } = render(
      <InstanceRootNodeContext.Provider value={document}>
        <ReactSelectWebComponentProvider>
          <div>child</div>
        </ReactSelectWebComponentProvider>
      </InstanceRootNodeContext.Provider>
    );

    const firstId = getByTestId('cache-provider').getAttribute('data-cache-id');

    act(() => {
      window.dispatchEvent(new CustomEvent('apryse-webcomponent-reconnected', { detail: { host } }));
    });

    expect(getByTestId('cache-provider').getAttribute('data-cache-id')).not.toBe(firstId);
  });
});
