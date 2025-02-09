import { act } from '@testing-library/react-hooks';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import useResizeObserver from './useResizeObserver';

// Mocking ResizeObserver as it's not available in Jest's JSDOM
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    this.callback([{ borderBoxSize: [{ inlineSize: 100, blockSize: 200 }] }]);
  }
  disconnect() { }
};

describe('useResizeObserver', () => {
  it('returns correct dimensions after observing', async () => {
    let dimensions;
    function DummyComponent() {
      const [ref, size] = useResizeObserver();
      dimensions = size;
      return <div ref={ref}></div>;
    }

    act(() => {
      render(<DummyComponent />);
    });

    await waitFor(() => {
      expect(dimensions).toEqual({ width: 100, height: 200 });
    });
  });
});