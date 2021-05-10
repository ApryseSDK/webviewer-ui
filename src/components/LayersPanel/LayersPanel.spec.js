import React from 'react';
import { render } from '@testing-library/react';

import LayersPanel from './LayersPanel';
import { debug } from 'webpack';

const TestLayersPanel = withI18n(LayersPanel);

const MOCK_LAYER_CLASS_NAME = 'layer';

jest.mock('components/Layer', () => {
  return function MockComponent() {
    return (<div className={MOCK_LAYER_CLASS_NAME}>LayerMock</div>);
  };
});

describe('Test for Layers Panel', () => {
  it('should be able to render without any props', () => {
    expect(() => {
      render(<TestLayersPanel />);
    }).not.toThrow();
  });
  it('should not be able to render Layers component with empty layers array props', () => {
    const layers = [

    ];
    const { container } = render(<TestLayersPanel layers={layers}/>);
    const mockLayerComponents = container.querySelectorAll(`.${MOCK_LAYER_CLASS_NAME}`);
    expect(mockLayerComponents).toHaveLength(layers.length);
  });
  it('should not be able to render Layers component with 1 element in layers array', () => {
    // arbitrary unique keys
    const layers = [
      {
        id: 'a'
      }
    ];
    const { container } = render(<TestLayersPanel layers={layers}/>);
    const mockLayerComponents = container.querySelectorAll(`.${MOCK_LAYER_CLASS_NAME}`);
    expect(mockLayerComponents).toHaveLength(layers.length);
  });
  it('should not be able to render Layers component with 2 elements in layers array', () => {
    // arbitrary unique keys
    const layers = [
      {
        id:'a'
      },
      {
        id:'b'
      }
    ];
    const { container } = render(<TestLayersPanel layers={layers}/>);
    const mockLayerComponents = container.querySelectorAll(`.${MOCK_LAYER_CLASS_NAME}`);
    expect(mockLayerComponents).toHaveLength(layers.length);
  });
});