import React from 'react';
import { act, render } from '@testing-library/react';
import EmotionProvider from './EmotionProvider';

let mockCacheCounter = 0;

jest.mock('@emotion/cache', () => {
  return jest.fn((options = {}) => ({
    __id: `cache-${++mockCacheCounter}`,
    sheet: {
      container: options.container,
    },
    options,
  }));
});

jest.mock('@emotion/react', () => ({
  CacheProvider: ({ children }) => <>{children}</>,
}));

jest.mock('helpers/getCspNonce', () => ({
  __esModule: true,
  default: () => '',
}));

describe('EmotionProvider reconnect behavior', () => {
  beforeEach(() => {
    mockCacheCounter = 0;
    window.isApryseWebViewerWebComponent = true;
  });

  afterEach(() => {
    delete window.isApryseWebViewerWebComponent;
  });

  it('recreates host emotion cache on matching webcomponent reconnect', () => {
    const host = document.createElement('apryse-webviewer');
    const shadowRoot = host.attachShadow({ mode: 'open' });

    const { rerender } = render(
      <EmotionProvider rootNode={shadowRoot}>
        <div>child</div>
      </EmotionProvider>
    );

    const firstCache = host.__emotionCache;
    expect(firstCache).toBeDefined();

    act(() => {
      window.dispatchEvent(new CustomEvent('apryse-webcomponent-reconnected', {
        detail: { host },
      }));
    });

    rerender(
      <EmotionProvider rootNode={shadowRoot}>
        <div>child</div>
      </EmotionProvider>
    );

    const secondCache = host.__emotionCache;
    expect(secondCache).toBeDefined();
    expect(secondCache).not.toBe(firstCache);
  });

  it('does not recreate host emotion cache when reconnect event is for a different host', () => {
    const host = document.createElement('apryse-webviewer');
    const otherHost = document.createElement('apryse-webviewer');
    const shadowRoot = host.attachShadow({ mode: 'open' });

    const { rerender } = render(
      <EmotionProvider rootNode={shadowRoot}>
        <div>child</div>
      </EmotionProvider>
    );

    const firstCache = host.__emotionCache;
    expect(firstCache).toBeDefined();

    act(() => {
      window.dispatchEvent(new CustomEvent('apryse-webcomponent-reconnected', {
        detail: { host: otherHost },
      }));
    });

    rerender(
      <EmotionProvider rootNode={shadowRoot}>
        <div>child</div>
      </EmotionProvider>
    );

    const secondCache = host.__emotionCache;
    expect(secondCache).toBe(firstCache);
  });
});
