import React, { useState } from 'react';
import ScaleSelector from './ScaleSelector';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import core from 'core';
import './ScaleOverlay.scss';
import { disableRtlModeParameters } from 'helpers/storybookParams';

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

let presetScales = ['1 mm = 10 mm'];
const scalesInfo = scales.map((scale) => ({
  scale,
  title: scale.toString(),
  measurementsNum: 1,
  pages: [1],
  canDelete: true,
}));

const notModifiableScalesInfo = scalesInfo.map((scaleInfo) => ({
  ...scaleInfo,
  canDelete: false,
}));

const initialState = {
  viewer: {
    currentPage: 1,
    isDocumentReadOnly: false,
  },
};

export function Basic() {
  const [selectedScales, setSelectedScales] = useState(presetScales);
  core.getScalePrecision = () => 0.1;
  const renderScale = (scale) => <div>{scale.toString()}</div>;
  return (
    <ReduxProvider store={configureStore({ reducer: () => initialState })}>
      <div className='ScaleOverlay'>
        <div className='scale-overlay-header'>
          <ScaleSelector
            scalesInfo={scalesInfo}
            selectedScales={selectedScales}
            onScaleSelected={(currentScale, selectedScale) => {
              setSelectedScales([selectedScale]);
            }}
            onDeleteScale={() => {}}
            renderScale={renderScale}
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
  const renderScale = (scale) => <div>{scale.toString()}</div>;
  return (
    <ReduxProvider store={configureStore({ reducer: () => initialState })}>
      <div className='ScaleOverlay'>
        <div className='scale-overlay-header'>
          <ScaleSelector
            scalesInfo={notModifiableScalesInfo}
            selectedScales={selectedScales}
            onScaleSelected={(currentScale, selectedScale) => {
              setSelectedScales([selectedScale]);
            }}
            onDeleteScale={() => {}}
            renderScale={renderScale}
            onAddingNewScale={() => {}}
          />
        </div>
      </div>
    </ReduxProvider>
  );
}

NotModifiable.parameters = disableRtlModeParameters;

export function UndefinedCoreScales() {
  const [selectedScales, setSelectedScales] = useState(presetScales);
  core.getScalePrecision = () => 0.1;
  const renderScale = (scale) => <div>{scale.toString()}</div>;
  return (
    <ReduxProvider store={configureStore({ reducer: () => initialState })}>
      <div className='ScaleOverlay'>
        <div className='scale-overlay-header'>
          <ScaleSelector
            scalesInfo={[]}
            selectedScales={selectedScales}
            onScaleSelected={(currentScale, selectedScale) => {
              setSelectedScales([selectedScale]);
            }}
            onDeleteScale={() => {}}
            renderScale={renderScale}
            onAddingNewScale={() => {}}
          />
        </div>
      </div>
    </ReduxProvider>
  );
}

UndefinedCoreScales.parameters = disableRtlModeParameters;
