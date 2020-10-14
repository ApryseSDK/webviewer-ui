import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import triggerEvent from 'helpers/fireEvent';
import ResizeBar from './ResizeBar';

const TestResizeBar = withProviders(ResizeBar);

const noop = () => {};

jest.mock('helpers/fireEvent', () => {
  return jest.fn();
});

describe('ResizeBar', () => {
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
