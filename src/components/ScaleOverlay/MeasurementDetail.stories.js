import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider as ReduxProvider } from 'react-redux';
import MeasurementDetail from './MeasurementDetail';

export default {
  title: 'Components/ScaleOverlay/MeasurementDetail',
  component: MeasurementDetail,
};

const initialState = {
  viewer: {
    currentPage: 1,
    isDocumentReadOnly: false
  }
};

const toolDefaults = {
  Scale: [[2, 'in'], [5, 'in']]
};

const mockSelectedTool = (tool) => {
  switch (tool) {
    case 'DistanceMeasurementCreateTool':
      return {
        name: 'DistanceMeasurementCreateTool',
        defaults: toolDefaults
      };
    case 'EllipseMeasurementCreateTool':
      return {
        name: 'EllipseMeasurementCreateTool',
        defaults: toolDefaults
      };
    default:
      return null;
  }
};

function noop() {}

const defaultSettings = [{
  'factor': 1,
  'unit': 'in',
  'decimalSymbol': '.',
  'thousandsSymbol': ',',
  'display': 'D',
  'precision': 100,
  'unitPrefix': '',
  'unitSuffix': '',
  'unitPosition': 'S',
}];

export function DistanceScaleOverlay() {
  const distanceMeasurementAnnot = new window.Core.Annotations.LineAnnotation();
  distanceMeasurementAnnot['Measure'] = {
    'scale': '1 in = 1 in',
    'axis': defaultSettings,
    'distance': defaultSettings,
    'area': defaultSettings,
  };
  distanceMeasurementAnnot['IT'] = 'LineDimension';
  distanceMeasurementAnnot['DisplayUnits'] = ['in'];
  distanceMeasurementAnnot['Scale'] = [[1, 'in'], [1, 'in']];
  distanceMeasurementAnnot['Precision'] = 0.01;

  distanceMeasurementAnnot['getAngle'] = () => 0;
  distanceMeasurementAnnot['Color'] = new window.Core.Annotations.Color(255, 0, 0);
  distanceMeasurementAnnot.getMeasurementTextWithScaleAndUnits = () => '1"';
  distanceMeasurementAnnot.getLineLength = () => 100;
  distanceMeasurementAnnot.Start = {
    'x': 100,
    'y': 100
  };
  distanceMeasurementAnnot.End = {
    'x': 200,
    'y': 200
  } ;

  return (
    <ReduxProvider store={configureStore({ reducer: () => initialState })}>
      <div className={'Overlay ScaleOverlay open'}>
        <MeasurementDetail
          isOpen={true}
          annotation={distanceMeasurementAnnot}
          selectedTool={mockSelectedTool('DistanceMeasurementCreateTool')}
        />
      </div>
    </ReduxProvider>
  );
}

export function EllipseScaleOverlay() {
  const mockEllipseAnnotation = new window.Core.Annotations.EllipseAnnotation();
  mockEllipseAnnotation['Scale'] = '';
  mockEllipseAnnotation['Width'] = 100;
  mockEllipseAnnotation['Height'] = 100;
  mockEllipseAnnotation['IT'] = 'EllipseDimension';
  mockEllipseAnnotation['Color'] = new window.Core.Annotations.Color(255, 0, 0);
  mockEllipseAnnotation['resize'] = noop;
  mockEllipseAnnotation['adjustContents'] = noop;
  mockEllipseAnnotation['Measure'] = {
    scale: '2 in = 5 in',
    axis: [{
      factor: 0.03472224409448819,
      precision: 100,
      thousandsSymbol: ',',
      display: 'D',
      decimalSymbol: '.'
    }],
    area: [{
      factor: 0.03472224409448819,
      precision: 100,
      thousandsSymbol: ',',
      display: 'D',
      decimalSymbol: '.'
    }]
  };
  mockEllipseAnnotation['Precision'] = 0.01;
  mockEllipseAnnotation.getPageNumber = () => 1;

  // Sets the text that appears in area field.
  // The actual calculation is more complicated, but irrelevant for front-end testing.
  // The contents should change automatically when the radius changes.
  mockEllipseAnnotation.getContents = function() {
    return `${(this.Width / 10).toFixed(2)} sq in`;
  };

  mockEllipseAnnotation.getMeasurementTextWithScaleAndUnits = function() {
    return `${(this.Width / 10).toFixed(2)} sq in`;
  };

  // Sets the initial size of the annotation.
  // The width and height should change automatically when the radius changes.
  mockEllipseAnnotation.getRect = function() {
    return {
      'x1': 100,
      'x2': 200,
      'y1': 100,
      'y2': 200,
    };
  };

  mockEllipseAnnotation.setWidth = function(w) {
    this.Width = Number(w);
  };

  mockEllipseAnnotation.setHeight = function(h) {
    this.Height = Number(h);
  };

  return (
    <ReduxProvider store={configureStore({ reducer: () => initialState })}>
      <div className={'Overlay ScaleOverlay open'}>
        <MeasurementDetail
          isOpen={true}
          annotation={mockEllipseAnnotation}
          selectedTool={mockSelectedTool('EllipseMeasurementCreateTool')}
        />
      </div>
    </ReduxProvider>
  );
}