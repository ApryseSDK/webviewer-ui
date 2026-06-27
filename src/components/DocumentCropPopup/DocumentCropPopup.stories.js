import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { MockApp, createStore as createMockAppStore } from 'helpers/storybookHelper';
import DocumentCropPopup from './DocumentCropPopup';
import { Provider } from 'react-redux';
import DimensionsInput from './DimensionsInput';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import initialState from 'src/redux/initialState';
import { userEvent, within, expect } from 'storybook/test';
import { getTranslatedText } from 'helpers/testTranslationHelper';
import { mobileStoryParameters } from 'helpers/storybookParams';

export default {
  title: 'Components/DocumentCropPopup',
  component: DocumentCropPopup,
};

const basicInitialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  },
};

function rootReducer(state = basicInitialState, action) {
  return state;
}

const store = configureStore({ reducer: rootReducer });

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

const noop = () => { };

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
      <div className="DocumentCropPopupContainer">
        <div className="DocumentCropPopup">
          <div className="document-crop-section">
            <DimensionsInput {...inputProps} />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export function DocumentCropPopupMobile() {
  const mobileProps = {
    pageNumberError: false,
  };

  return (
    <Provider store={store}>
      <div className="DocumentCropPopupContainer">
        <DocumentCropPopup {...popupProps} isMobile={true} isInDesktopOnlyMode={false} {...mobileProps} />
      </div>
    </Provider>
  );
}

DocumentCropPopupMobile.parameters = mobileStoryParameters;

export function PopupInApp(args, context) {
  const { addonRtl } = context.globals;
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeToolName: 'CropPage',
      openElements: {
        documentCropPopup: true,
      },
      isInDesktopOnlyMode: false,
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  const mockAppStore = createMockAppStore(mockState);
  setItemToFlyoutStore(mockAppStore);

  return (
    <MockApp initialState={mockState} initialDirection={addonRtl} />
  );
}

// Add interactive tests that clicks on Edit ribbon
PopupInApp.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const editRibbon = canvas.getByRole('button', { name: getTranslatedText('option.toolbarGroup.toolbarGroup-Edit') });
  await userEvent.click(editRibbon);

  // Wait for popup to fully position
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const snippingToolButton = await canvas.findByRole('button', { name: getTranslatedText('annotation.crop') });
  expect(snippingToolButton).toBeInTheDocument();
};

PopupInApp.parameters = {
  layout: 'fullscreen',
  chromatic: { delay: 10000 },
};
