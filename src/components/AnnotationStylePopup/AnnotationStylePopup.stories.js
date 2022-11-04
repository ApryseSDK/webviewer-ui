import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import AnnotationStylePopup from './AnnotationStylePopup';
import viewerReducer from 'reducers/viewerReducer';
import initialState from 'src/redux/initialState';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import { mapAnnotationToKey } from 'constants/map';

export default {
  title: 'Components/AnnotationStylePopup',
  component: AnnotationStylePopup,
  argTypes: {
    // when annotation or the annotations style are updated using storybook controls
    // Annotation.Color objects are converted to plain JS objects and component will crash
    // so disabling controls for now. There are ways to get this working (like converting them back to Annotation.Color object) but not going to do it at this point
    annotation: {
      table: {
        disable: true
      }
    },
    style: {
      table: {
        disable: true
      }
    }
  }
};

// Mock some state to show the style popups
initialState.viewer.openElements.stylePopupTextStyleContainer = true;
initialState.viewer.openElements.stylePopupColorsContainer = true;

const reducer = combineReducers({
  viewer: viewerReducer(initialState.viewer),
});
const store = createStore(reducer);

const BasicTemplate = (args) => {
  return (
    <ReduxProvider store={store}>
      <AnnotationStylePopup {...args} />
    </ReduxProvider>
  );
};

// using line annotation as "basic" test because it's has one of the most simple UI for
const lineAnnot = new window.Annotations.LineAnnotation();

export const Basic = BasicTemplate.bind({});
Basic.args = {
  annotations: [lineAnnot],
  style: getAnnotationStyles(lineAnnot),
  closeElement: () => { },
  properties: {
    StrokeStyle: 'solid'
  },
  colorMapKey: mapAnnotationToKey(lineAnnot),
};

const distanceMeasurementAnnot = new window.Annotations.LineAnnotation();
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

const noop = () => {};
distanceMeasurementAnnot['IT'] = 'LineDimension';
distanceMeasurementAnnot['DisplayUnits'] = ['in'];
distanceMeasurementAnnot['Scale'] = [[1, 'in'], [1, 'in']];
distanceMeasurementAnnot['Precision'] = 0.01;
distanceMeasurementAnnot['ToolName'] = 'AnnotationCreateDistanceMeasurement';
distanceMeasurementAnnot['setStartStyle'] = noop;
distanceMeasurementAnnot['setEndStyle'] = noop;

export const DistanceMeasurement = BasicTemplate.bind({});
const measurementProperties = {
  StartLineStyle: distanceMeasurementAnnot.getStartStyle(),
  EndLineStyle: distanceMeasurementAnnot.getEndStyle(),
  StrokeStyle: 'solid'
};

DistanceMeasurement.args = {
  annotations: [distanceMeasurementAnnot],
  style: getAnnotationStyles(distanceMeasurementAnnot),
  properties: measurementProperties,
  colorMapKey: mapAnnotationToKey(distanceMeasurementAnnot),
  showLineStyleOptions: true,
};

const freeTextAnnot = new window.Annotations.FreeTextAnnotation();
export const FreeText = BasicTemplate.bind({});
const richTextStyles = freeTextAnnot.getRichTextStyle();
const freeTextProperties = {
  Font: freeTextAnnot.Font,
  FontSize: freeTextAnnot.FontSize,
  TextAlign: freeTextAnnot.TextAlign,
  TextVerticalAlign: freeTextAnnot.TextVerticalAlign,
  bold: richTextStyles?.[0]?.['font-weight'] === 'bold' ?? false,
  italic: richTextStyles?.[0]?.['font-style'] === 'italic' ?? false,
  underline: richTextStyles?.[0]?.['text-decoration']?.includes('underline') || richTextStyles?.[0]?.['text-decoration']?.includes('word'),
  strikeout: richTextStyles?.[0]?.['text-decoration']?.includes('line-through') ?? false,
  StrokeStyle: 'solid',
};

FreeText.args = {
  annotations: [freeTextAnnot],
  style: getAnnotationStyles(freeTextAnnot),
  properties: freeTextProperties,
  colorMapKey: mapAnnotationToKey(freeTextAnnot),
  isFreeText: true,
};

const widgetPlaceHolderAnnot = new window.Annotations.RectangleAnnotation();
widgetPlaceHolderAnnot.isFormFieldPlaceholder = () => true;
widgetPlaceHolderAnnot.getCustomData = () => 'TextFormField';

export const WidgetPlaceHolder = BasicTemplate.bind({});
WidgetPlaceHolder.args = {
  annotations: [widgetPlaceHolderAnnot],
  style: getAnnotationStyles(widgetPlaceHolderAnnot),
  closeElement: () => { },
  properties: {
    StrokeStyle: 'solid'
  },
  colorMapKey: mapAnnotationToKey(widgetPlaceHolderAnnot),
};
