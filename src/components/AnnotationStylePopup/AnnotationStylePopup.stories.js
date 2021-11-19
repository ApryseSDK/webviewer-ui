import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider as ReduxProvider } from "react-redux";
import AnnotationStylePopup from './AnnotationStylePopup';
import viewerReducer from 'reducers/viewerReducer';
import initialState from 'src/redux/initialState';
import getAnnotationStyles from 'helpers/getAnnotationStyles';

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

const reducer = combineReducers({
  viewer: viewerReducer(initialState.viewer),
});
const store = createStore(reducer);

const BasicTemplate = (args) => {
  return (
    <ReduxProvider store={store}>
      <div id='app'>
        <AnnotationStylePopup {...args} />
      </div>
    </ReduxProvider>
  );
};

// using line annotation as "basic" test because it's has one of the most simple UI for
const lineAnnot = new window.Core.Annotations.LineAnnotation();
export const Basic = BasicTemplate.bind({});
Basic.args = {
	annotation: lineAnnot,
	style: getAnnotationStyles(lineAnnot),
	closeElement: () => {},
};

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

export const DistanceMeasurement = BasicTemplate.bind({});
DistanceMeasurement.args = {
	annotation: distanceMeasurementAnnot,
	style: getAnnotationStyles(distanceMeasurementAnnot),
	closeElement: () => {},
};

const freeTextAnnot = new window.Core.Annotations.FreeTextAnnotation();
export const FreeText = BasicTemplate.bind({});
FreeText.args = {
	annotation: freeTextAnnot,
	style: getAnnotationStyles(freeTextAnnot),
	closeElement: () => {},
};

const widgetPlaceHolderAnnot = new window.Core.Annotations.RectangleAnnotation();
widgetPlaceHolderAnnot.setCustomData('trn-form-field-type', 'TextFormField');
widgetPlaceHolderAnnot

export const WidgetPlaceHolder = BasicTemplate.bind({});
WidgetPlaceHolder.args = {
	annotation: widgetPlaceHolderAnnot,
	style: getAnnotationStyles(widgetPlaceHolderAnnot),
	closeElement: () => {},
};
