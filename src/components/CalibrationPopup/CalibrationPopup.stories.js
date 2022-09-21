import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import CalibrationPopup from './CalibrationPopup';
import viewerReducer from 'reducers/viewerReducer';
import initialState from 'src/redux/initialState';

export default {
  title: 'Components/CalibrationPopup',
  component: CalibrationPopup,
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
      <CalibrationPopup {...args} />
    </ReduxProvider>
  );
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
distanceMeasurementAnnot['IT'] = 'LineDimension';
distanceMeasurementAnnot['DisplayUnits'] = ['in'];
distanceMeasurementAnnot['Scale'] = [[1, 'in'], [1, 'in']];
distanceMeasurementAnnot['Precision'] = 0.01;

export const Basic = BasicTemplate.bind({});
Basic.args = {
  annotation: distanceMeasurementAnnot,
};
