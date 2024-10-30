import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import * as getRootNodeModule from '../../../src/helpers/getRootNode';

import triggerEvent from 'helpers/fireEvent';
import ResizeBar from './ResizeBar';

const TestResizeBar = withProviders(ResizeBar);

jest.mock('helpers/fireEvent', () => {
  return jest.fn();
});

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
    const width = 200;
    const dataElement = 'resizeBar';
    const { container } = render(<TestResizeBar onResize={jest.fn()} minWidth={width} dataElement={dataElement} />);
    const resizeBar = container.querySelector('[data-element="resizeBar"]');
    fireEvent.mouseDown(resizeBar);
    fireEvent.mouseMove(resizeBar);

    expect(triggerEvent).toBeCalledWith('panelResized', { element: dataElement, width });
  });
});
