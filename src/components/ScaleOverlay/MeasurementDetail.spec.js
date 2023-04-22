import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EllipseScaleOverlay } from './MeasurementDetail.stories';

const noop = () => { };

jest.mock('core', () => ({
  addEventListener: noop,
  removeEventListener: noop,
  jumpToAnnotation: noop,
  getDocumentViewer: () => ({
    getAnnotationManager: () => ({
      deselectAllAnnotations: noop,
      selectAnnotation: noop,
    })
  }),
  getAnnotationManager: () => ({
    selectAnnotation: noop,
    redrawAnnotation: noop,
    trigger: noop
  }),
  getTool: () => ({
    finish: noop
  })
}));


describe('MeasurementDetail', () => {
  it('renders the EllipseScaleOverlay storybook component', () => {
    expect(() => {
      render(<EllipseScaleOverlay />);
    }).not.toThrow();
  });

  it('increases the area when the radius increases', () => {
    render(<EllipseScaleOverlay />);

    const radiusInput = screen.getByDisplayValue('1.74');
    const areaTextElement = screen.getByText('10.00 sq in');

    const beforeText = areaTextElement.textContent;
    fireEvent.change(radiusInput, { target: { value: '2' } });
    const afterText = areaTextElement.textContent;
    const beforeValue = parseFloat(beforeText.substring(0, beforeText.indexOf(' ')));
    const afterValue = parseFloat(afterText.substring(0, afterText.indexOf(' ')));

    expect(beforeValue).toBeLessThan(afterValue);
  });

  it('sets area to zero when radius is zero', () => {
    render(<EllipseScaleOverlay />);

    const radiusInput = screen.getByDisplayValue('1.74');
    const areaTextElement = screen.getByText('10.00 sq in');

    fireEvent.change(radiusInput, { target: { value: '0' } });
    const afterText = areaTextElement.textContent;
    const afterValue = parseFloat(afterText.substring(0, afterText.indexOf(' ')));

    expect(afterValue).toEqual(0);
  });
});