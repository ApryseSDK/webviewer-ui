import core from 'core';
import React from 'react';
import CellBorders from './CellBorders';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { within, expect } from 'storybook/test';
import { getTranslatedText } from 'helpers/testTranslationHelper';

const createMockDocumentViewer = (getSelectedCellRange, cells) => () => ({
  getSpreadsheetEditorManager: () => ({
    getSelectedCellRange,
    getSelectedCells: () => cells,
  }),
});
const originalCoreGetDocumentViewer = core.getDocumentViewer;

const mockConfigs = {
  multipleCells: {
    range: () => ({ firstRow: 0, lastRow: 1, firstColumn: 0, lastColumn: 1 }),
    cells: [
      { getStyle: () => ({ getCellBorder: () => ({ style: 'Thin' }) }) },
      { getStyle: () => ({ getCellBorder: () => ({}) }) }
    ],
    isSingleCell: false
  },
  singleCell: {
    range: () => ({ firstRow: 1, lastRow: 1, firstColumn: 1, lastColumn: 1 }),
    cells: [{
      getStyle: () => ({
        getCellBorder: (side) => {
          return ['Right', 'Left'].includes(side)
            ? { style: 'Thin' }
            : { style: 'None' };
        }
      })
    }],
    isSingleCell: true
  },
  noBorders: {
    range: () => ({ firstRow: 1, lastRow: 1, firstColumn: 1, lastColumn: 1 }),
    cells: [{
      getStyle: () => ({ getCellBorder: () => ({ style: 'None' }) })
    }],
    isSingleCell: true
  }
};

const createMockStore = (isSingleCell) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      spreadsheetEditor: {
        cellProperties: {
          isSingleCell,
          styles: {}
        }
      }
    }
  });
};

const createMockDecorator = (configKey) => {
  const MockDecorator = (Story) => {
    const config = mockConfigs[configKey];
    core.getDocumentViewer = createMockDocumentViewer(config.range, config.cells);
    const mockStore = createMockStore(config.isSingleCell);
    return (
      <Provider store={mockStore}>
        <Story />
      </Provider>
    );
  };
  MockDecorator.displayName = `MockDecorator_${configKey}`;
  return MockDecorator;
};

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
        name: getTranslatedText(`spreadsheetEditor.${name}`),
      });
      expect(button)[state === 'alwaysShow' ? 'toBeInTheDocument' : 'toBeNull']();
    })
  );
};

const createPlayFunction = (checkAll = false) => async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  try {
    if (checkAll) {
      await Promise.all(
        Object.keys(expectedButtons).map(async (name) => {
          const button = canvas.getByRole('button', {
            name: getTranslatedText(`spreadsheetEditor.${name}`),
          });
          expect(button).toBeInTheDocument();
        })
      );
    } else {
      await checkButtonVisibility(canvas, expectedButtons);
    }
  } finally {
    core.getDocumentViewer = originalCoreGetDocumentViewer;
  }
};

const createStory = (dataElement, mockConfig, checkAll = false) => {
  const story = Template.bind({});
  story.args = {
    isFlyoutItem: true,
    disabled: false,
    dataElement,
  };
  story.decorators = [createMockDecorator(mockConfig)];
  story.play = createPlayFunction(checkAll);
  if (!checkAll) {
    story.parameters = window.storybook.disableRtlMode;
  }
  return story;
};

export default {
  title: 'ModularComponents/CellBorders',
  component: CellBorders,
  decorators: [
    (Story) => {
      core.getDocumentViewer = originalCoreGetDocumentViewer;
      return (
        <div>
          <style>
            {`
              .icon-grid .row .Button.active {
                box-shadow: inset 0 0 0 1px var(--blue-5);
              }
            `}
          </style>
          <Story />
        </div>
      );
    },
  ],
};

const Template = (args) => <CellBorders {...args} />;

export const FlyoutWithSingleCell = createStory('cellBordersFlyoutSingle', 'singleCell');
export const FlyoutWithAllButtons = createStory('cellBordersFlyoutAll', 'multipleCells', true);
export const FlyoutWithNoBorders = createStory('cellBordersFlyoutNoBorders', 'noBorders');