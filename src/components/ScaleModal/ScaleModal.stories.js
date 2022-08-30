import React from 'react';
import ScaleModal from './ScaleModal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import core from 'core';
import { getMeasurementScalePreset, initialScale } from 'constants/measurementScale';

export default {
  title: 'Components/ScaleModal',
  component: ScaleModal
};

core.getScales = () => [];
core.getScalePrecision = () => 0.1;

window.Core.Scale.getFormattedValue = () => '';

const getStore = () => {
  const initialState = {
    viewer: {
      openElements: { scaleModal: true },
      disabledElements: {},
      calibrationInfo: {
        tempScale: '',
        isFractionalUnit: false
      },
      measurementScalePreset: getMeasurementScalePreset(),
      measurementUnits: {
        from: ['in', 'mm', 'cm', 'pt'],
        to: ['in', 'mm', 'cm', 'pt', 'ft', 'ft-in', 'm', 'yd', 'km', 'mi'],
      },
      selectedScale: initialScale,
      customElementOverrides: {},
    }
  };

  function rootReducer(state = initialState, action) {
    return state;
  }

  return createStore(rootReducer);
};

export function Basic() {
  return (
    <Provider store={getStore()}>
      <ScaleModal />
    </Provider>
  );
}
