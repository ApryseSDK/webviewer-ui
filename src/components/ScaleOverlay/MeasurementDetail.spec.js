import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EllipseScaleOverlay } from './MeasurementDetail.stories';
import MeasurementDetail from './MeasurementDetail';
import getAngleInRadians from 'helpers/getAngleInRadians';

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

jest.mock('helpers/getAngleInRadians');


describe('MeasurementDetail', () => {
  const perimeterMeasurementCreateTool = {
    name: 'PerimeterMeasurementCreateTool',
    defaults: {
      Scale: [[2, 'in'], [5, 'in']]
    }
  };
  const defaultMeasure = {
    'scale': '1 in = 1 in',
    'axis': [{
      'factor': 1,
      'unit': 'in',
      'decimalSymbol': '.',
      'thousandsSymbol': ',',
      'display': 'D',
      'precision': 100,
      'unitPrefix': '',
      'unitSuffix': '',
      'unitPosition': 'S',
    }],
    'distance': [{
      'factor': 1,
      'unit': 'in',
      'decimalSymbol': '.',
      'thousandsSymbol': ',',
      'display': 'D',
      'precision': 100,
      'unitPrefix': '',
      'unitSuffix': '',
      'unitPosition': 'S',
    }],
    'area': [{
      'factor': 1,
      'unit': 'sq in',
      'decimalSymbol': '.',
      'thousandsSymbol': ',',
      'display': 'D',
      'precision': 100,
      'unitPrefix': '',
      'unitSuffix': '',
      'unitPosition': 'S',
    }],
  };

  function createPerimeterAnnototation() {
    const perimeterMeasurementAnnot = new window.Core.Annotations.PolylineAnnotation();
    perimeterMeasurementAnnot['Measure'] = defaultMeasure;
    perimeterMeasurementAnnot['IT'] = 'PolyLineDimension';
    perimeterMeasurementAnnot['DisplayUnits'] = ['in'];
    perimeterMeasurementAnnot['Scale'] = [[1, 'in'], [1, 'in']];
    perimeterMeasurementAnnot['Precision'] = 0.01;
    perimeterMeasurementAnnot['Color'] = new window.Core.Annotations.Color(255, 0, 0);
    perimeterMeasurementAnnot.getMeasurementTextWithScaleAndUnits = () => '10 in';
    perimeterMeasurementAnnot.getPath = () => [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 0 }
    ];

    return perimeterMeasurementAnnot;
  }

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

  it('should render angle when getAngleInRadians returns a valid number', () => {
    getAngleInRadians.mockReturnValue(Math.PI / 4); // 45 degrees
    render(
      <MeasurementDetail
        isOpen={true}
        annotation={createPerimeterAnnototation()}
        selectedTool={perimeterMeasurementCreateTool}
        canModify={true}
      />
    );
    expect(screen.getByText(/45.00°/)).toBeInTheDocument();
  });

  it.each([NaN, null, undefined, 0])('should render angle as 0 when getAngleInRadians returns %s', (testValue) => {
    getAngleInRadians.mockReturnValue(testValue);
    render(
      <MeasurementDetail
        isOpen={true}
        annotation={createPerimeterAnnototation()}
        selectedTool={perimeterMeasurementCreateTool}
        canModify={true}
      />
    );
    expect(screen.getByText(/0°/)).toBeInTheDocument();
  });
});