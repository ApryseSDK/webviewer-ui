import React from 'react';
import { render } from '@testing-library/react';
import {
  Basic as BasicStory, 
  FreeText as FreeTextPopUpStory,
  DistanceMeasurement as DistanceMeasurementStory,
} from "./AnnotationStylePopup.stories";
import getAnnotationStyles from 'helpers/getAnnotationStyles';

const AnnotationStylePopupStory = withI18n(BasicStory);
const FreeTextStory = withI18n(FreeTextPopUpStory);
const DistanceStory = withI18n(DistanceMeasurementStory);

const lineAnnot = new window.Core.Annotations.LineAnnotation();

const distanceMeasurementAnnot = new window.Core.Annotations.LineAnnotation();
distanceMeasurementAnnot['Measure'] = {
  'scale': '1 in = 1 in',
  'axis': [
    {
      'factor': 0.0138889,
      'unit': 'in',
      'decimalSymbol': '.',
      'thousandsSymbol': ',',
      'display': 'D',
      'precision': 100,
      'unitPrefix': '',
      'unitSuffix': '',
      'unitPosition': 'S',
    },
  ],
  'distance': [
    {
      'factor': 1,
      'unit': 'in',
      'decimalSymbol': '.',
      'thousandsSymbol': ',',
      'display': 'D',
      'precision': 100,
      'unitPrefix': '',
      'unitSuffix': '',
      'unitPosition': 'S',
    },
  ],
  'area': [
    {
      'factor': 1,
      'unit': 'sq in',
      'decimalSymbol': '.',
      'thousandsSymbol': ',',
      'display': 'D',
      'precision': 100,
      'unitPrefix': '',
      'unitSuffix': '',
      'unitPosition': 'S',
    },
  ],
};
distanceMeasurementAnnot['IT'] = 'LineDimension';
distanceMeasurementAnnot['DisplayUnits'] = ['in'];
distanceMeasurementAnnot['Scale'] = [[1, 'in'],[1, 'in']];
distanceMeasurementAnnot['Precision'] = 0.01;

const freeTextAnnot = new window.Core.Annotations.FreeTextAnnotation();

describe('AnnotationStylePopup component', () => {
  beforeEach(() => {
    window.documentViewer = new window.Core.DocumentViewer();
    window.documentViewer.doc = new window.Core.Document('dummy', 'pdf');
  });

  it('Basic story should not throw any errors', () => {
    expect(() => {
      render(<AnnotationStylePopupStory 
        annotation={lineAnnot}
        style={getAnnotationStyles(lineAnnot)}
        closeElement={() => {}}
      />);
    }).not.toThrow();
  });
  
  it('Distance story should not throw any errors', () => {
    expect(() => {
      render(<DistanceStory 
        annotation={lineAnnot}
        style={getAnnotationStyles(distanceMeasurementAnnot)}
        closeElement={() => {}}
      />);
    }).not.toThrow();
  });

  it('Distance story should have extra controls', () => {
    const { container } = render(<DistanceStory 
      annotation={distanceMeasurementAnnot}
      style={getAnnotationStyles(distanceMeasurementAnnot)}
      closeElement={() => {}}
    />);

    const measurementControls = container.querySelector(".MeasurementOption");
    expect(measurementControls).toBeInTheDocument();
  });

  it('FreeText story should not throw any errors', () => {
    expect(() => {
      render(<FreeTextStory 
        annotation={freeTextAnnot}
        style={getAnnotationStyles(freeTextAnnot)}
        closeElement={() => {}}
      />);
    }).not.toThrow();
  });

  it('FreeText story should have three header options', () => {
    const { container } = render(<FreeTextStory 
      annotation={freeTextAnnot}
      style={getAnnotationStyles(freeTextAnnot)}
      closeElement={() => {}}
    />);

    const headersOptions = Array.from(container.querySelectorAll('.palette-options-button'));
    expect(headersOptions.filter(h => h.textContent === 'Stroke').length).toEqual(1);
    expect(headersOptions.filter(h => h.textContent === 'Text').length).toEqual(1);
    expect(headersOptions.filter(h => h.textContent === 'Fill').length).toEqual(1);
  });
});