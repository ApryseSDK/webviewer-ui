import React from 'react';
import DocumentCropPopup from './DocumentCropPopup';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import DimensionsInput from './DimensionsInput';

export default {
  title: 'Components/DocumentCropPopup',
  component: DocumentCropPopup,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  },
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

const createMockAnnotation = () => {
  return {
    getPageNumber: function() {
      return 1;
    },
    getRect: function() {
      return {
        x1: 1,
        x2: 2,
        y1: 3,
        y2: 4,
      };
    },
  };
};

const mockCropDimensions = {
  'Letter': {
    'yOffset': 0,
    'height': 11,
    'xOffset': 0,
    'width': 8.5,
  },
  'Half letter': {
    'yOffset': 0,
    'height': 5.5,
    'xOffset': 0,
    'width': 8.5,
  },
  'Junior legal': {
    'yOffset': 0,
    'height': 5,
    'xOffset': 0,
    'width': 8,
  }
}

const noop = () => {};

const popupProps = {
  cropAnnotation: createMockAnnotation(),
  cropMode: 'ALL_PAGES',
  onCropModeChange: noop,
  getCropDimension: noop,
  setCropTop: '1',
  setCropBottom: '1',
  setCropLeft: '1',
  setCropRight: '1',
  closeDocumentCropPopup: noop,
  applyCrop: noop,
  isCropping: true,
  getPageHeight: noop,
  getPageWidth: noop,
  redrawCropAnnotations: noop,
  isInDesktopOnlyMode: false,
  isMobile: false,
  getPageCount: () => {9},
  getCurrentPage: () => {1},
  selectedPages: [],
  onSelectedPagesChange: noop,
  presetCropDimensions: mockCropDimensions
};

const popup = <DocumentCropPopup {...popupProps} />;

const inputProps = {
  top: 1,
  right: 1,
  bottom: 1,
  left: 1,
  unit: 'Inches (in)',
  autoTrim: 'Letter',
  supportedUnits: {
    'Inches (in)': '"',
    'Centimeters (cm)': 'cm',
    'Millimeters (mm)': 'mm',
  },
  autoTrimOptions: ['Letter', 'Half letter', 'Junior legal'],
  onDimensionChange: noop,
  onUnitChange: noop,
  autoTrimActive: true,
  setAutoTrimActive: noop,
  onAutoTrimChange: noop,
};

export function Basic() {
  return (
    <Provider store={store}>
      <div className="DocumentCropPopupContainer">
        <DocumentCropPopup {...popupProps} />
      </div>
    </Provider>
  );
}

export function Dimensions() {
  return(
    <Provider store={store}>
    <div className="DocumentCropPopup" style={{maxWidth: '226px'}}>
      <DimensionsInput {...inputProps} />
    </div>
  </Provider>
  );
}
