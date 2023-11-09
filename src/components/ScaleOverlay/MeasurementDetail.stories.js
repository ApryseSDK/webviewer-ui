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

const mockSelectedTool = {
  name: 'EllipseMeasurementCreateTool',
  defaults: {
    Scale: [[2, 'in'], [5, 'in']]
  }
};

function noop() {}

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
          selectedTool={mockSelectedTool}
        />
      </div>
    </ReduxProvider>
  );
}