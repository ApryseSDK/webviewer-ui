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
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    getPageNumber() {
      return 1;
    },
    getRect() {
      return {
        x1: 1,
        x2: 2,
        y1: 3,
        y2: 4,
      };
    },
    getX() {
      return this.x;
    },
    getY() {
      return this.y;
    },
    getWidth() {
      return this.width;
    },
    getHeight() {
      return this.height;
    },
    setX(x) {
      this.x = Number(x);
    },
    setY(y) {
      this.y = Number(y);
    },
    setWidth(w) {
      this.width = Number(w);
    },
    setHeight(h) {
      this.height = Number(h);
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
};

const noop = () => {};

const popupProps = {
  cropAnnotation: createMockAnnotation(),
  cropMode: 'ALL_PAGES',
  onCropModeChange: noop,
  closeDocumentCropPopup: noop,
  applyCrop: noop,
  isCropping: true,
  getPageHeight() {
    return 792;
  },
  getPageWidth() {
    return 612;
  },
  isPageRotated() {
    return false;
  },
  redrawCropAnnotations: noop,
  isInDesktopOnlyMode: false,
  isMobile: false,
  getPageCount: () => {
    9;
  },
  getCurrentPage: () => {
    1;
  },
  selectedPages: [],
  onSelectedPagesChange: noop,
  presetCropDimensions: mockCropDimensions
};

const inputProps = {
  yOffset: 1,
  width: 1,
  height: 1,
  xOffset: 1,
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
  return (
    <Provider store={store}>
      <div className="DocumentCropPopup" style={{ maxWidth: '226px' }}>
        <DimensionsInput {...inputProps} />
      </div>
    </Provider>
  );
}
