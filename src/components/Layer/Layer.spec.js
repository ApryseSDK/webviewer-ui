import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Layer from './Layer';
const TestLayer = withProviders(Layer);

describe('Test for Layer', () => {
  let layer;
  beforeEach(() => {
    layer = {
      name: 'test',
      locked: false,
      visible: false
    };
  });

  it('should be able to render without any props', () => {
    expect(() => {
      render(<TestLayer />);
    }).not.toThrow();
  });

  it('should be able to render with layer and updateLayer prop', () => {
    const { container } = render(<TestLayer layer={layer} />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('should be not be checked when its not visible', () => {
    const { container } = render(<TestLayer layer={layer} />);
    const input = container.querySelector('input');
    expect(input).not.toHaveAttribute('checked');
  });

  it('should be checked when its visible', () => {
    layer.visible = true;
    const { container } = render(<TestLayer layer={layer} />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('checked');
  });

  it('should be not be disabled when its not locked', () => {
    const { container } = render(<TestLayer layer={layer} />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute('disabled');
  });

  it('should be disabled when its locked', () => {
    layer.locked = true;
    const { container } = render(<TestLayer layer={layer} />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('disabled');
  });

  it('should be able to call layerUpdated props if defined', () => {
    const mockCallBack = jest.fn();
    const { container } = render(<TestLayer layer={layer} layerUpdated={mockCallBack} />);
    const input = container.querySelector('input[type="checkbox"]');
    fireEvent.click(input);
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});