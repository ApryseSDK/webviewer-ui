import core from 'core';
import React from 'react';
import CellBorders from './CellBorders';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { within, expect } from '@storybook/test';
import i18next from 'i18next';

const createMockDocumentViewer = (getSelectedCellRange, cells) => () => ({
  getSpreadsheetEditorManager: () => ({
    getSelectedCellRange,
    getSelectedCells: () => cells,
  }),
});
const store = configureStore({ reducer: rootReducer });
const originalCoreGetDocumentViewer = core.getDocumentViewer;

export default {
  title: 'ModularComponents/CellBorders',
  component: CellBorders,
  decorators: [
    (Story) => {
      core.getDocumentViewer = originalCoreGetDocumentViewer;
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

const withMultipleCells = (Story) => {
  core.getDocumentViewer = createMockDocumentViewer(
    () => ({ firstRow: 0, lastRow: 1, firstColumn: 0, lastColumn: 1 }),
    [1, 2]
  );
  return <Story />;
};

const withSingleCell = (Story) => {
  core.getDocumentViewer = createMockDocumentViewer(
    () => ({ firstRow: 1, lastRow: 1, firstColumn: 1, lastColumn: 1 }),
    [1]
  );
  return <Story />;
};

const Template = (args) => <CellBorders {...args} />;

const expectedButtons = {
  'none': 'alwaysShow',
  'all': 'showForMultipleCells',
  'top': 'alwaysShow',
  'left': 'alwaysShow',
  'right': 'alwaysShow',
  'bottom': 'alwaysShow',
  'outside': 'alwaysShow',
  'inside': 'showForMultipleCells',
  'vertical': 'showForMultipleCells',
  'horizontal': 'showForMultipleCells',
};

const checkButtonVisibility = async (canvas, expectedMapping) => {
  await Promise.all(
    Object.entries(expectedMapping).map(async ([name, state]) => {
      const button = canvas.queryByRole('button', {
        name: i18next.t(`spreadsheetEditor.${name}`),
      });
      if (state === 'alwaysShow') {
        expect(button).toBeInTheDocument();
      } else {
        expect(button).toBeNull();
      }
    })
  );
};

export const FlyoutWithSingleCell = Template.bind({});
FlyoutWithSingleCell.args = {
  isFlyoutItem: true,
  disabled: false,
  dataElement: 'cellBordersFlyoutSingle',
};
FlyoutWithSingleCell.decorators = [withSingleCell];
FlyoutWithSingleCell.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  try {
    await checkButtonVisibility(canvas, expectedButtons);
  } finally {
    core.getDocumentViewer = originalCoreGetDocumentViewer;
  }
};

export const FlyoutWithAllButtons = Template.bind({});
FlyoutWithAllButtons.args = {
  isFlyoutItem: true,
  disabled: false,
  dataElement: 'cellBordersFlyoutAll',
};
FlyoutWithAllButtons.decorators = [withMultipleCells];
FlyoutWithAllButtons.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  try {
    await Promise.all(
      Object.keys(expectedButtons).map(async (name) => {
        const button = canvas.getByRole('button', {
          name: i18next.t(`spreadsheetEditor.${name}`),
        });
        expect(button).toBeInTheDocument();
      })
    );
  } finally {
    core.getDocumentViewer = originalCoreGetDocumentViewer;
  }
};