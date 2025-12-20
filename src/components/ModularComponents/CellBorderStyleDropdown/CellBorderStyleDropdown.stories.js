import React from 'react';
import { Provider } from 'react-redux';
import CellBorderStyleDropdown from './CellBorderStyleDropdown';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { userEvent, within, expect } from 'storybook/test';
import { getTranslatedText } from 'helpers/testTranslationHelper';

export default {
  title: 'SpreadsheetEditor/CellBorderStyleDropdown',
  component: CellBorderStyleDropdown,
};

const createMockStore = (borderStyles = null) => {
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
          isSingleCell: true,
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

const store = createMockStore();

export function Basic() {
  return (
    <Provider store={store}>
      <div style={{ width: 100 }}>
        <label id='cellBorderStyle' htmlFor='cellBorderStyleDropdown'>Border Style</label>
        <CellBorderStyleDropdown id='cellBorderStyleDropdown' labelledById='cellBorderStyle' />
      </div>
    </Provider>
  );
}

Basic.parameters = window.storybook.disableRtlMode;

export function Open() {
  return Basic();
}

Open.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const cellBorderStyleDropdown = canvas.getByRole('combobox');
  await userEvent.click(cellBorderStyleDropdown);

  const noneOption = canvas.queryByRole('option', { name: getTranslatedText('option.cellBorderStyle.none') });
  expect(noneOption).toBeNull();

  const solidOption = canvas.getByRole('option', { name: getTranslatedText('option.cellBorderStyle.thin') });
  expect(solidOption).toBeInTheDocument();
  expect(solidOption.classList.contains('active')).toBe(true);

  const dashedOption = canvas.getByRole('option', { name: getTranslatedText('option.cellBorderStyle.dashed') });
  expect(dashedOption).toBeInTheDocument();

  const dottedOption = canvas.getByRole('option', { name: getTranslatedText('option.cellBorderStyle.dotted') });
  expect(dottedOption).toBeInTheDocument();
};

Open.parameters = window.storybook.disableRtlMode;