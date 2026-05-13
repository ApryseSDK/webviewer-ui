import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import * as getRootNodeModule from '../../../src/helpers/getRootNode';

import triggerEvent from 'helpers/fireEvent';
import ResizeBar from './ResizeBar';

const TestResizeBar = withProviders(ResizeBar);

jest.mock('helpers/fireEvent', () => {
  return jest.fn();
});

jest.mock('hooks/useIsRTL', () => jest.fn(() => false));

describe('ResizeBar', () => {
  beforeEach(() => {
    jest.spyOn(getRootNodeModule, 'getInstanceNode').mockReturnValue(window);
    window.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      right: 1024,
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });


  it('Dragging the resize bar should trigger the panelResized event', () => {
    jest.useFakeTimers();
    const minWidth = 200;
    const dataElement = 'resizeBar';
    const { container } = render(<TestResizeBar onResize={jest.fn()} minWidth={minWidth} dataElement={dataElement} currentWidth={250} />
    );
    const resizeBar = container.querySelector('[data-element="resizeBar"]');
    // Simulate drag: mouse down at 100, move to 300 (delta = 200)
    fireEvent.mouseDown(resizeBar, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 300 });
    jest.runAllTimers();
    expect(triggerEvent).toBeCalledWith('panelResized', { element: dataElement, width: 450 });
    fireEvent.mouseUp(document);
    jest.useRealTimers();
  });


  describe('MultiViewerResizeBar', () => {

    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('renders without crashing', () => {
      const { container } = render(
        <TestResizeBar
          onResize={() => {}}
          minWidth={100}
          dataElement="resize-bar"
          currentWidth={200}
        />
      );
      const bar = container.querySelector('.resize-bar');
      expect(bar).toBeInTheDocument();
    });

    it('calls onResize with correct delta in LTR', () => {
      const onResize = jest.fn();
      const { container } = render(
        <TestResizeBar
          onResize={onResize}
          minWidth={100}
          dataElement="resize-bar"
          currentWidth={200}
        />
      );
      const bar = container.querySelector('.resize-bar');
      // Simulate drag: mouse down at 100, move to 120
      fireEvent.mouseDown(bar, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 120 });
      jest.runAllTimers();
      expect(onResize).toHaveBeenCalledWith(220);
      fireEvent.mouseUp(document);
    });

    it('calls onResize with correct delta in RTL', () => {
      const useIsRTL = require('hooks/useIsRTL');
      useIsRTL.mockReturnValue(true);
      const onResize = jest.fn();
      const { container } = render(
        <TestResizeBar
          onResize={onResize}
          minWidth={100}
          dataElement="resize-bar"
          currentWidth={200}
        />
      );
      expect(useIsRTL()).toEqual(true);
      const bar = container.querySelector('.resize-bar');
      // Simulate drag: mouse down at 100, move to 120 (RTL: delta is -20)
      fireEvent.mouseDown(bar, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 120 });
      jest.runAllTimers();
      expect(onResize).toHaveBeenCalledWith(180);
      fireEvent.mouseUp(document);
    });
  });

});
