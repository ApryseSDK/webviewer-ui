import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as performClipboardActionOnCells from 'src/helpers/performClipboardActionOnCells';
import CopyPasteCutButton from './CopyPasteCutButton';

jest.mock('../../../Helpers/menuItems', () => ({
  menuItems: {
    cellCopy: { dataElement: 'copyButton', icon: 'copy-icon', title: 'Copy' },
    cellPaste: { dataElement: 'pasteButton', icon: 'paste-icon', title: 'Paste' },
    cellCut: { dataElement: 'cutButton', icon: 'cut-icon', title: 'Cut' }
  }
}));

jest.mock('selectors', () => ({
  getCanCopy: jest.fn(() => true),
  getCanPaste: jest.fn(() => true),
  getCanCut: jest.fn(() => true),
  isElementDisabled: jest.fn(() => false),
  getFeatureFlags: jest.fn(() => {}),
  getCustomElementOverrides: jest.fn(() => {}),
  getActiveDocumentViewerKey: jest.fn(() => 1)
}));

jest.mock('src/helpers/performClipboardActionOnCells', () => jest.fn());

const store = configureStore({
  reducer: () => ({
    viewer: {
      uiConfiguration: 'spreadsheetEditor',
    },
    spreadsheetEditor: {
      cellProperties: {
        canCopy: true,
        canPaste: true,
        canCut: true,
      }
    }
  }),
});

const renderButton = (actionType, additionalProps = {}) => {
  const defaultProps = {
    onKeyDownHandler: () => {},
    disabled: false,
    actionType,
    ...additionalProps
  };

  return render(
    <Provider store={store}>
      <div style={{ width: '310px', padding: '16px' }}>
        <CopyPasteCutButton {...defaultProps} />
      </div>
    </Provider>
  );
};

describe('Spreadsheet Clipboard Buttons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the CopyButton component correctly', () => {
    expect(() => {
      renderButton('copy');
    }).not.toThrow();
  });

  it('renders the PasteButton component correctly', () => {
    expect(() => {
      renderButton('paste');
    }).not.toThrow();
  });

  it('renders the CutButton component correctly', () => {
    expect(() => {
      renderButton('cut');
    }).not.toThrow();
  });

  it('should call performClipboardActionOnCells with "copy" when CopyButton is clicked', async () => {
    renderButton('copy');

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    userEvent.click(copyButton);

    expect(performClipboardActionOnCells).toHaveBeenCalledWith('copy');
  });

  it('should call performClipboardActionOnCells with "paste" when PasteButton is clicked', async () => {
    renderButton('paste');

    const pasteButton = screen.getByRole('button', { name: 'Paste' });
    userEvent.click(pasteButton);

    expect(performClipboardActionOnCells).toHaveBeenCalledWith('paste');
  });

  it('should call performClipboardActionOnCells with "cut" when CutButton is clicked', async () => {
    renderButton('cut');

    const cutButton = screen.getByRole('button', { name: 'Cut' });
    userEvent.click(cutButton);

    expect(performClipboardActionOnCells).toHaveBeenCalledWith('cut');
  });
});