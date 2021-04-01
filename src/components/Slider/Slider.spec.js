import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Slider from './Slider';

class FakeMouseEvent extends MouseEvent {
  constructor(type, values) {
    const { pageX, pageY, offsetX, offsetY, x, y, ...mouseValues } = values;
    super(type, mouseValues);

    Object.assign(this, {
      offsetX: offsetX || 0,
      offsetY: offsetY || 0,
      pageX: pageX || 0,
      pageY: pageY || 0,
      x: x || 0,
      y: y || 0,
    });
  }
}

const getMouseEvent = (type, values) => {
  values = {
    bubbles: true,
    cancelable: true,
    ...values,
  };
  return new FakeMouseEvent(type, values);
};

const TestSlider = withProviders(Slider);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockProperty = 'FontSize';
const mockProps = {
  property: mockProperty,
  value: '10.186089078706528',
  displayProperty: 'text',
  getDisplayValue: jest.fn(a => a),
  dataElement: 'fontSizeSlider',
  getCirclePosition: jest.fn().mockReturnValue(1),
  convertRelativeCirclePositionToValue: jest.fn().mockReturnValue(1),
  onStyleChange: jest.fn(),
  onSliderChange: jest.fn(),
};

describe('Slider', () => {
  it('should not be able to render without any props', () => {
    expect(() => {
      render(<TestSlider />);
    }).toThrow();
  });

  it('should be able to render Slider with all props provided', () => {
    render(<TestSlider {...mockProps} />);
  });

  describe('adjusting the slider', () => {
    let container;
    let svg;
    beforeEach(() => {
      jest.clearAllMocks();

      container = render(<TestSlider {...mockProps} />).container;
      svg = container.querySelector('svg');

      fireEvent(
        svg,
        getMouseEvent('mousedown', {
          pageX: 250,
        }),
      );
    });

    it('calls onSliderChange on mousedown', () => {
      expect(mockProps.onStyleChange).not.toHaveBeenCalled();
      expect(mockProps.onSliderChange).toHaveBeenCalled();
      expect(container.querySelector('.slider-value').textContent).toBe('1');
    });

    it('calls onSliderChange on mousemove', () => {
      jest.clearAllMocks();

      fireEvent(
        svg,
        getMouseEvent('mousemove', {
          pageX: 260,
        }),
      );

      expect(mockProps.onStyleChange).not.toHaveBeenCalled();
      expect(mockProps.onSliderChange).toHaveBeenCalled();
      expect(container.querySelector('.slider-value').textContent).toBe('1');
    });

    it('calls onStyleChange on mouseup', () => {
      jest.clearAllMocks();

      fireEvent(
        svg,
        getMouseEvent('mouseup', {
          pageX: 250,
        }),
      );

      expect(mockProps.onStyleChange).toHaveBeenCalledWith(mockProperty, 1);
      expect(mockProps.onSliderChange).not.toHaveBeenCalled();
      expect(container.querySelector('.slider-value').textContent).toBe('1');
    });
  });
});
