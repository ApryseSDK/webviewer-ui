import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

const mockProperty = 'FontSize';
const mockProps = {
  property: mockProperty,
  value: '10.186089078706528',
  displayProperty: 'text',
  getDisplayValue: jest.fn((a) => a),
  dataElement: 'fontSizeSlider',
  getCirclePosition: jest.fn().mockReturnValue(1),
  convertRelativeCirclePositionToValue: jest.fn().mockReturnValue(1),
  onSliderChange: jest.fn(),
};

const mockPropertyStroke = 'StrokeThickness';
const mockPropsStroke = {
  property: mockPropertyStroke,
  value: 2.05,
  displayProperty: 'thickness',
  getDisplayValue: jest.fn().mockReturnValue('2px'),
  dataElement: 'strokeThicknessSlider',
  getCirclePosition: jest.fn(),
  convertRelativeCirclePositionToValue: jest.fn(),
  onSliderChange: jest.fn(),
  withInputField: true,
  inputFieldType: 'number',
  min: 0,
  max: 20,
  step: 0.01,
  getLocalValue: (value) => value,
};

const mockAccessibleProperties = {
  property: mockPropertyStroke,
  value: 2.05,
  displayProperty: 'thickness',
  getDisplayValue: (value) => value,
  dataElement: 'strokeThicknessSlider',
  getCirclePosition: jest.fn(),
  convertRelativeCirclePositionToValue: jest.fn(),
  onSliderChange: jest.fn(),
  withInputField: true,
  inputFieldType: 'number',
  min: 0,
  max: 20,
  step: 0.01,
  getLocalValue: (value) => value,
};

const mockPropertyOpacity = 'Opacity';
const mockPropsOpacity = {
  property: mockPropertyOpacity,
  value: 52,
  displayProperty: 'opacity',
  getDisplayValue: (opacity) => `${Math.round(opacity)}%`,
  dataElement: 'opacitySlider',
  getCirclePosition: jest.fn(),
  convertRelativeCirclePositionToValue: jest.fn().mockReturnValue(52),
  onSliderChange: jest.fn(),
  withInputField: true,
  inputFieldType: 'number',
  min: 0,
  max: 100,
  step: 1,
  getLocalValue: jest.fn().mockReturnValue(52),
};

describe('Slider', () => {
  it('should not be able to render without any props', () => {
    // Mock the console.error so we don't dump a wall of red text
    // to the console even though the test pass as it can be misleading.
    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => { });

    expect(() => {
      render(<TestSlider />);
    }).toThrow();

    console.error.mockRestore();
  });

  it('should be able to render Slider with all props provided', () => {
    render(<TestSlider {...mockProps} />);
  });

  it('should be able to render Slider with stroke props provided', () => {
    render(<TestSlider {...mockPropsStroke} />);
  });

  it('should be able to render Slider with opacity props provided', () => {
    render(<TestSlider {...mockPropsOpacity} />);
  });

  it('ensuring the slider is accessible', () => {
    render(<TestSlider {...mockAccessibleProperties} />);
    const textBox = screen.getByRole('textbox');
    expect(textBox).toHaveValue('2.05');
    screen.getByRole('textbox', { name: /Stroke/i });
    userEvent.clear(textBox);
    userEvent.type(textBox, '4');
    expect(screen.getByRole('textbox')).toHaveValue('4');

    screen.getByRole('slider', { name: /Stroke/i });
    expect(screen.getByRole('slider', { name: /Stroke/i })).toHaveValue('4');
  });

  describe('adjusting the stroke slider', () => {
    let container;
    let svg;
    beforeEach(() => {
      jest.clearAllMocks();

      container = render(<TestSlider {...mockPropsStroke} />).container;
      svg = container.querySelector('input');

      fireEvent(
        svg,
        getMouseEvent('mousedown', {
          pageX: 250,
        }),
      );
    });

    it('changes to local value and editable input on input focus', () => {
      container.querySelector('.slider-input-field').focus();
      const editableInput = container.querySelector('.slider-input-field');
      expect(container.querySelector('.slider-input-field').value).toBe('2.05');
      editableInput.value = 2.07;
      expect(container.querySelector('.slider-input-field').value).toBe('2.07');
      editableInput.blur();
      expect(container.querySelector('.slider-input-field').value).toBe('2px');
    });

    it('changes to value from getDisplayValue on input blur', () => {
      container.querySelector('.slider-input-field').focus();
      container.querySelector('.slider-input-field').blur();
      expect(container.querySelector('.slider-input-field').value).toBe('2px');
    });

    it('shows value from getDisplayValue when mouse down on slider', () => {
      expect(container.querySelector('.slider-input-field').value).toBe('2px');
    });

    it('shows value from getDisplayValue when mouse move on slider', () => {
      jest.clearAllMocks();

      fireEvent(
        svg,
        getMouseEvent('mousemove', {
          pageX: 260,
        }),
      );
      expect(container.querySelector('.slider-input-field').value).toBe('2px');
    });
  });

  describe('adjusting the opacity slider', () => {
    let container;
    let svg;
    beforeEach(() => {
      jest.clearAllMocks();

      container = render(<TestSlider {...mockPropsOpacity} />).container;
      svg = container.querySelector('input');

      fireEvent(
        svg,
        getMouseEvent('mousedown', {
          pageX: 250,
        }),
      );
    });

    it('changes to local value and editable input on input focus', () => {
      container.querySelector('.slider-input-field').focus();
      const editableInput = container.querySelector('.slider-input-field');
      expect(container.querySelector('.slider-input-field').value).toBe('52');
      editableInput.value = 53.57;
      expect(container.querySelector('.slider-input-field').value).toBe('53.57');
      editableInput.blur();
      expect(container.querySelector('.slider-input-field').value).toBe('52%');
    });

    it('changes to value from getDisplayValue on input blur', () => {
      container.querySelector('.slider-input-field').focus();
      container.querySelector('.slider-input-field').blur();
      expect(container.querySelector('.slider-input-field').value).toBe('52%');
    });

    it('shows value from getDisplayValue when mouse down on slider', () => {
      expect(container.querySelector('.slider-input-field').value).toBe('52%');
    });

    it('shows value from getDisplayValue when mouse move on slider', () => {
      jest.clearAllMocks();

      fireEvent(
        svg,
        getMouseEvent('mousemove', {
          pageX: 260,
        }),
      );
      expect(container.querySelector('.slider-input-field').value).toBe('52%');
    });
  });
});
