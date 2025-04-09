import React from 'react';
import ScaleModal from './ScaleModal';
import { Provider } from 'react-redux';
import core from 'core';
import { getMeasurementScalePreset, initialScale } from 'constants/measurementScale';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'Components/ScaleModal',
  component: ScaleModal,
};

core.getScales = () => [];
core.getScalePrecision = () => 0.1;
core.getViewerElement = () => {};

const initialState = {
  viewer: {
    openElements: { scaleModal: true },
    disabledElements: {},
    hiddenElements: {},
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
    isAddingNewScale: true,
  }
};

export function Basic() {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <ScaleModal />
    </Provider>
  );
}
