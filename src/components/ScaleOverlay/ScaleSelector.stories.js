import React from 'react';
import ScaleSelector from './ScaleSelector';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import core from 'core';
import './ScaleOverlay.scss';

export default {
  title: 'Components/ScaleOverlay/ScaleSelector',
  component: ScaleSelector,
};

const scales = [
  {
    '_pageScale': { 'value': 1, 'unit': 'mm' },
    '_worldScale': { 'value': 10, 'unit': 'mm' },
    'pageScale': { 'value': 1, 'unit': 'mm' },
    'worldScale': { 'value': 10, 'unit': 'mm' }
  }
];

const selectedScales = ['1 mm = 10 mm'];

const initialState = {
  viewer: {
    currentPage: 1,
    isDocumentReadOnly: false
  }
};

export function Basic() {
  core.getScalePrecision = () => true;
  return (
    <ReduxProvider store={configureStore({ reducer: () => initialState })}>
      <div className='ScaleOverlay'>
        <div className='scale-overlay-header'>
          <ScaleSelector
            scales={scales}
            selectedScales={selectedScales}
            onScaleSelected={() => { }}
            onAddingNewScale={() => { }}
          />
        </div>
      </div>
    </ReduxProvider>
  );
}


