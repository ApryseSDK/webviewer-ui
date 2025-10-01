import React, { useState } from 'react';
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
    'worldScale': { 'value': 10, 'unit': 'mm' },
    toString: () => '1 mm = 10 mm',
  },
  {
    '_pageScale': { 'value': 1, 'unit': 'in' },
    '_worldScale': { 'value': 50, 'unit': 'in' },
    'pageScale': { 'value': 1, 'unit': 'in' },
    'worldScale': { 'value': 50, 'unit': 'in' },
    toString: () => '1 in = 50 in',
  },
  {
    '_pageScale': { 'value': 1, 'unit': 'cm' },
    '_worldScale': { 'value': 25, 'unit': 'cm' },
    'pageScale': { 'value': 1, 'unit': 'cm' },
    'worldScale': { 'value': 25, 'unit': 'cm' },
    toString: () => '1 cm = 25 cm',
  },
];

const coreScales = {
  '1 mm = 10 mm': [new window.Core.Annotations.ArcAnnotation()], // ArcAnnotation and generic annotation are mocked as same type.
  '1 in = 50 in': [new window.Core.Annotations.ArcAnnotation()],
  '1 cm = 25 cm': [new window.Core.Annotations.ArcAnnotation()],
};

let presetScales = ['1 mm = 10 mm'];

const initialState = {
  viewer: {
    currentPage: 1,
    isDocumentReadOnly: false,
  },
};

export function Basic() {
  const [selectedScales, setSelectedScales] = useState(presetScales);
  core.getScalePrecision = () => 0.1;
  core.getScales = () => coreScales;
  core.canModify = () => true;
  return (
    <ReduxProvider store={configureStore({ reducer: () => initialState })}>
      <div className='ScaleOverlay'>
        <div className='scale-overlay-header'>
          <ScaleSelector
            scales={scales}
            selectedScales={selectedScales}
            onScaleSelected={(currentScale, selectedScale) => {
              setSelectedScales([selectedScale]);
            }}
            onAddingNewScale={() => {}}
          />
        </div>
      </div>
    </ReduxProvider>
  );
}

export function NotModifiable() {
  const [selectedScales, setSelectedScales] = useState(presetScales);
  core.getScalePrecision = () => 0.1;
  core.canModify = () => false;
  core.getScales = () => coreScales;
  return (
    <ReduxProvider store={configureStore({ reducer: () => initialState })}>
      <div className='ScaleOverlay'>
        <div className='scale-overlay-header'>
          <ScaleSelector
            scales={scales}
            selectedScales={selectedScales}
            onScaleSelected={(currentScale, selectedScale) => {
              setSelectedScales([selectedScale]);
            }}
            onAddingNewScale={() => {}}
          />
        </div>
      </div>
    </ReduxProvider>
  );
}

NotModifiable.parameters = window.storybook.disableRtlMode;

export function UndefinedCoreScales() {
  const [selectedScales, setSelectedScales] = useState(presetScales);
  core.getScalePrecision = () => 0.1;
  core.canModify = () => true;
  core.getScales = () => ({ '1 mm = 10 mm': undefined });
  return (
    <ReduxProvider store={configureStore({ reducer: () => initialState })}>
      <div className='ScaleOverlay'>
        <div className='scale-overlay-header'>
          <ScaleSelector
            scales={scales}
            selectedScales={selectedScales}
            onScaleSelected={(currentScale, selectedScale) => {
              setSelectedScales([selectedScale]);
            }}
            onAddingNewScale={() => {}}
          />
        </div>
      </div>
    </ReduxProvider>
  );
}

UndefinedCoreScales.parameters = window.storybook.disableRtlMode;
