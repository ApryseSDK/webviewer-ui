import React from 'react';
import PrintModalComponent from './PrintModal';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { userEvent, within, expect } from '@storybook/test';
import { copyMapWithDataProperties } from 'constants/map';

const NOOP = () => { };

export default {
  title: 'Components/PrintModal',
  component: PrintModalComponent,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    customPanels: [],
    openElements: {
      printModal: true,
    },
    pageLabels: [],
    sortStrategy: 'position',
    colorMap: copyMapWithDataProperties('currentStyleTab', 'iconColor'),
    displayMode: 'Single',
    currentPage: 1
  },
  document: {
    printQuality: 1,
  },
  featureFlags: {
    customizableUI: false,
  },
};

const store = configureStore({
  reducer: () => initialState
});

const props = {
  isDisabled: false,
  isOpen: true,
  isApplyWatermarkDisabled: false,
  existingWatermarksRef: { current: null },
  currentPage: 1,
  setIsGrayscale: NOOP,
  setIsCurrentView: NOOP,
  setShouldFlatten: NOOP,
  setIncludeAnnotations: NOOP,
  setIncludeComments: NOOP,
  setIsWatermarkModalVisible: NOOP,
  setAllowWatermarkModal: NOOP,
  closePrintModal: NOOP,
  createPagesAndPrint: NOOP,
  pagesToPrint: [],
  setPagesToPrint: NOOP,
  count: 0,
  isPrinting: false,
};

export const PrintModal = () => (
  <Provider store={store}>
    <div>
      <PrintModalComponent
        {...props}
        isFullAPIEnabled={false}
        useEmbeddedPrint={false}
      />
    </div>
  </Provider>
);

// Testing if we show an error when the user types a page number that is greater than the total number of pages
PrintModal.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const customPagesButton = await canvas.getByLabelText('Specify Pages');
  await userEvent.click(customPagesButton);
  const customPagesInput = await document.getElementById('specifyPagesInput');
  expect(customPagesInput).toBeInTheDocument();
  await userEvent.click(customPagesInput);
  await userEvent.type(customPagesInput, '11', { delay: 100 });
  const testError = await canvas.getByText('Invalid page number. Limit is 9');
  expect(testError).toBeInTheDocument();
};

export const EmbeddedPrintModal = () => (
  <Provider store={store}>
    <div>
      <PrintModalComponent
        {...props}
        isFullAPIEnabled={true}
        useEmbeddedPrint={true}
      />
    </div>
  </Provider>
);
