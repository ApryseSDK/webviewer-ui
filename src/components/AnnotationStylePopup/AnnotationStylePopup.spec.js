import React from 'react';
import { render, waitFor } from '@testing-library/react';
import {
  Basic as BasicStory,
  FreeText as FreeTextPopUpStory,
  DistanceMeasurement as DistanceMeasurementStory,
  WidgetPlaceHolder as WidgetPlaceHolderStory
} from './AnnotationStylePopup.stories';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import { mapAnnotationToKey } from 'constants/map';

const AnnotationStylePopupStory = withI18n(BasicStory);
const FreeTextStory = withI18n(FreeTextPopUpStory);
const DistanceStory = withI18n(DistanceMeasurementStory);
const WidgetStory = withI18n(WidgetPlaceHolderStory);

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
distanceMeasurementAnnot['Scale'] = [[1, 'in'], [1, 'in']];
distanceMeasurementAnnot['Precision'] = 0.01;

const freeTextAnnot = new window.Core.Annotations.FreeTextAnnotation();

const widgetPlaceHolderAnnot = new window.Core.Annotations.RectangleAnnotation();
widgetPlaceHolderAnnot.setCustomData('trn-form-field-type', 'TextFormField');

describe('AnnotationStylePopup component', () => {
  beforeEach(() => {
    window.documentViewer = new window.Core.DocumentViewer();
    window.documentViewer.doc = new window.Core.Document('dummy', 'pdf');
  });

  it('Basic story should not throw any errors', () => {
    expect(() => {
      render(<AnnotationStylePopupStory
        annotations={[lineAnnot]}
        style={getAnnotationStyles(lineAnnot)}
        properties={{}}
        colorMapKey={mapAnnotationToKey(lineAnnot)}
      />);
    }).not.toThrow();
  });

  it('Distance story should not throw any errors', () => {
    expect(() => {
      render(<DistanceStory
        annotations={[distanceMeasurementAnnot]}
        style={getAnnotationStyles(distanceMeasurementAnnot)}
        properties={{}}
        colorMapKey={mapAnnotationToKey(distanceMeasurementAnnot)}
      />);
    }).not.toThrow();
  });

  it('Distance story should have extra controls', () => {
    const { container } = render(<DistanceStory
      annotations={[distanceMeasurementAnnot]}
      style={getAnnotationStyles(distanceMeasurementAnnot)}
      properties={{}}
      colorMapKey={mapAnnotationToKey(distanceMeasurementAnnot)}
    />);

    const measurementControls = container.querySelector('.MeasurementOption');
    expect(measurementControls).toBeInTheDocument();
  });

  it('FreeText story should not throw any errors', () => {
    expect(() => {
      render(<FreeTextStory
        annotations={[freeTextAnnot]}
        style={getAnnotationStyles(freeTextAnnot)}
        properties={{}}
        colorMapKey={mapAnnotationToKey(freeTextAnnot)}
      />);
    }).not.toThrow();
  });

  it('FreeText story should have three header options', () => {
    const { container } = render(<FreeTextStory
      annotations={[freeTextAnnot]}
      style={getAnnotationStyles(freeTextAnnot)}
      properties={{}}
      colorMapKey={mapAnnotationToKey(freeTextAnnot)}
    />);


    const headersOptions = Array.from(container.querySelectorAll('.palette-options-button'));
    expect(headersOptions.filter((h) => h.textContent === 'Stroke').length).toEqual(1);
    expect(headersOptions.filter((h) => h.textContent === 'Text').length).toEqual(1);
    expect(headersOptions.filter((h) => h.textContent === 'Fill').length).toEqual(1);
  });

  it('Widget placeholder story should not render opacity slider', async () => {
    const { container } = render(<WidgetStory
      annotations={[widgetPlaceHolderAnnot]}
      style={getAnnotationStyles(widgetPlaceHolderAnnot)}
      closeElement={() => { }}
      properties={{}}
      colorMapKey={mapAnnotationToKey(widgetPlaceHolderAnnot)}
    />);

    container.querySelectorAll('.palette-options-button')[2].click();

    await waitFor(() => {
      expect(container.querySelectorAll('.slider[data-element="opacitySlider"]').length).toEqual(0);
    }, {});
  });
});