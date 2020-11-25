import React from 'react';
import { render } from '@testing-library/react';

import Layer from './Layer';

const TestLayer = withProviders(Layer);

describe('Test for Layer', () => {
  let layer;
  let updateLayer;
  beforeEach(() => {
    layer = {
      name: 'test'
    };
    updateLayer = () => {};
  });
  it('should be able to render without any props', () => {
    expect(() => {
      render(<TestLayer />);
    }).not.toThrow();
  });

  it('should be able to render with layer and updateLayer prop', () => {
    // name is required for Input
    const { container } = render(<TestLayer layer={layer}  updateLayer={updateLayer}/>);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('should be not be checked when its not visible', () => {
    layer = {
      ...layer,
      visible: false
    };
    const { container } = render(<TestLayer layer={layer}  updateLayer={updateLayer}/>);
    const input = container.querySelector('input');
    expect(input).not.toHaveAttribute('checked');
  });

  it('should be checked when its visible', () => {
    layer = {
      ...layer,
      visible: true
    };
    const { container } = render(<TestLayer layer={layer}  updateLayer={updateLayer}/>);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('checked');
  });

  it('should be not be disabled when its not locked', () => {
    layer = {
      ...layer,
      locked: false
    };
    const { container } = render(<TestLayer layer={layer}  updateLayer={updateLayer}/>);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute('disabled');
  });

  it('should be disabled when its locked', () => {
    layer = {
      ...layer,
      locked: true
    };
    const { container } = render(<TestLayer layer={layer}  updateLayer={updateLayer}/>);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('disabled')
  });
});