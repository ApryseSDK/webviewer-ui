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
    isSingleCell: false,
    borderStyles: null
  },
  singleCell: {
    range: () => ({ firstRow: 1, lastRow: 1, firstColumn: 1, lastColumn: 1 }),
    cells: [{
      getStyle: () => ({
        getCellBorder: (side) => {
          return ['Right', 'Left'].includes(side)
            // eslint-disable-next-line custom/no-hex-colors
            ? { style: 'Thin', color: '#000000' }
            : { style: 'None', color: null };
        }
      })
    }],
    isSingleCell: true,
    borderStyles: {
      top: { color: null, style: 'None' },
      // eslint-disable-next-line custom/no-hex-colors
      right: { color: '#000000', style: 'Thin' },
      bottom: { color: null, style: 'None' },
      // eslint-disable-next-line custom/no-hex-colors
      left: { color: '#000000', style: 'Thin' },
    }
  },
  noBorders: {
    range: () => ({ firstRow: 1, lastRow: 1, firstColumn: 1, lastColumn: 1 }),
    cells: [{
      getStyle: () => ({ getCellBorder: () => ({ style: 'None' }) })
    }],
    isSingleCell: true,
    borderStyles: {
      top: { color: null, style: 'None' },
      right: { color: null, style: 'None' },
      bottom: { color: null, style: 'None' },
      left: { color: null, style: 'None' },
    }
  }
};

const createMockStore = (isSingleCell, borderStyles = null) => {
  const defaultBorderStyles = {
    top: { color: null, style: 'None' },
    right: { color: null, style: 'None' },
    bottom: { color: null, style: 'None' },
    left: { color: null, style: 'None' },
  };

  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      spreadsheetEditor: {
        cellProperties: {
          isSingleCell,
          styles: {
            border: borderStyles || defaultBorderStyles
          }
        },
        selectedBorderStyleListOption: 'Thin',
        // eslint-disable-next-line custom/no-hex-colors
        selectedBorderColorOption: '#000000',
      }
    }
  });
};

const createMockDecorator = (configKey) => {
  const MockDecorator = (Story) => {
    const config = mockConfigs[configKey];
    core.getDocumentViewer = createMockDocumentViewer(config.range, config.cells);
    const mockStore = createMockStore(config.isSingleCell, config.borderStyles);
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