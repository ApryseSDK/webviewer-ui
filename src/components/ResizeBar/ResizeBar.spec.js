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
    expect(triggerEvent).toBeCalledWith('panelResized', [dataElement, 450]);
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

  describe('Resize bar with multiple instances', () => {
    const MIN_WIDTH = 100;
    const MOCK_HOST_RECT = { left: 50, right: 600 };
    const MOUSE_MOVEMENT_DISTANCE = 400;

    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
      jest.restoreAllMocks();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    const setupResizeBar = ({ instanceRect = MOCK_HOST_RECT } = {}) => {
      jest.spyOn(getRootNodeModule, 'getInstanceRect').mockReturnValue(instanceRect);
      const onResize = jest.fn();
      const { container } = render(
        <TestResizeBar onResize={onResize} minWidth={MIN_WIDTH} dataElement="resize-bar" />
      );
      const bar = container.querySelector('.resize-bar');
      return { bar, onResize };
    };

    it('should use local host rect for a panel resize', () => {
      const expectedDisplacement = MOUSE_MOVEMENT_DISTANCE - MOCK_HOST_RECT.left;
      const { bar, onResize } = setupResizeBar();

      fireEvent.mouseDown(bar);
      fireEvent.mouseMove(document, { clientX: MOUSE_MOVEMENT_DISTANCE });
      jest.runAllTimers();

      expect(onResize).toHaveBeenCalledWith(expectedDisplacement);
      expect(getRootNodeModule.getInstanceRect).toHaveBeenCalledWith(bar);
      fireEvent.mouseUp(document);
    });
  });
});
