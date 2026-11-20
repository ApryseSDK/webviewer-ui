import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormulaBar from './FormulaBar';
import core from 'core';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockProvider = {
  onFormulaBarTextChange: jest.fn(),
  onFormulaBarSelectionChanged: jest.fn(),
  onFormulaBarFocus: jest.fn(),
  onFormulaBarKeyDown: jest.fn(),
  onFormulaBarSelectFormula: jest.fn(),
};

let mockClipboardEnabled = true;
let consoleWarnSpy;
const mockSpreadsheetEditorManager = {
  getFormulaBarProvider: jest.fn(() => mockProvider),
  disableClipboard: jest.fn(() => {
    mockClipboardEnabled = false;
  }),
  enableClipboard: jest.fn(() => {
    mockClipboardEnabled = true;
  }),
  isClipboardEnabled: jest.fn(() => mockClipboardEnabled),
};

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(() => ({
    getSpreadsheetEditorManager: jest.fn(() => mockSpreadsheetEditorManager),
  })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

const initialState = {
  viewer: {}
};

function rootReducer(state = initialState) {
  return state;
}
const store = configureStore({ reducer: rootReducer });

describe('FormulaBar', () => {
  let rerender;
  let originalScrollIntoViewDescriptor;

  beforeEach(() => {
    originalScrollIntoViewDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView');
    jest.clearAllMocks();
    mockClipboardEnabled = true;
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    ({ rerender } = render(
      <Provider store={store}>
        <FormulaBar
          isReadOnly={false}
          activeCellRange="A1"
          cellFormula=""
          stringCellValue=""
          onRangeInputChange={jest.fn()}
          onRangeInputKeyDown={jest.fn()}
        />
      </Provider>
    ));
    // Trigger 'spreadsheetEditorReady' to set up the Provider
    const handler = core.addEventListener.mock.calls.find(
      ([eventName]) => eventName === 'spreadsheetEditorReady'
    )?.[1];
    if (handler) {
      handler();
    } else {
      throw new Error('spreadsheetEditorReady handler not registered');
    }
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    if (originalScrollIntoViewDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScrollIntoViewDescriptor);
    } else {
      delete HTMLElement.prototype.scrollIntoView;
    }
  });

  it('calls onFormulaBarFocus when the formula input is focused', async () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.click(formulaInput);
    expect(mockProvider.onFormulaBarFocus).toHaveBeenCalled();
  });

  it('calls onFormulaBarTextChange when the formula input changes', async () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.type(formulaInput, '=SUM');
    expect(mockProvider.onFormulaBarTextChange).toHaveBeenCalledWith('=SUM');
  });

  it('calls onFormulaBarKeyDown when a key is pressed in the formula input', async () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.click(formulaInput);
    fireEvent.keyDown(formulaInput, { key: '=' });
    expect(mockProvider.onFormulaBarKeyDown).toHaveBeenCalled();
  });

  it('lets the spreadsheet editor commit multiline text before preventing native Enter', () => {
    let wasDefaultPreventedAtProvider;
    mockProvider.onFormulaBarKeyDown.mockImplementation((event) => {
      wasDefaultPreventedAtProvider = event.defaultPrevented;
    });
    rerender(
      <Provider store={store}>
        <FormulaBar
          isReadOnly={false}
          activeCellRange="A2"
          cellFormula=""
          stringCellValue={'First\nSecond'}
          multiline={true}
          onRangeInputChange={jest.fn()}
          onRangeInputKeyDown={jest.fn()}
        />
      </Provider>
    );

    const formulaInput = screen.getByRole('textbox', { name: 'Formula Bar' });
    const dispatchResult = fireEvent.keyDown(formulaInput, { key: 'Enter' });

    expect(wasDefaultPreventedAtProvider).toBe(false);
    expect(dispatchResult).toBe(false);
  });

  it('inserts a newline on Alt+Enter without invoking the spreadsheet Enter handler', () => {
    rerender(
      <Provider store={store}>
        <FormulaBar
          isReadOnly={false}
          activeCellRange="A2"
          cellFormula=""
          stringCellValue="FirstSecond"
          multiline={true}
          onRangeInputChange={jest.fn()}
          onRangeInputKeyDown={jest.fn()}
        />
      </Provider>
    );

    const formulaInput = screen.getByRole('textbox', { name: 'Formula Bar' });
    formulaInput.setSelectionRange(5, 5);

    expect(fireEvent.keyDown(formulaInput, { key: 'Enter', altKey: true })).toBe(false);
    expect(formulaInput).toHaveValue('First\nSecond');
    expect(formulaInput.selectionStart).toBe(6);
    expect(formulaInput.selectionEnd).toBe(6);
    expect(mockProvider.onFormulaBarSelectionChanged).toHaveBeenCalledWith(6);
    expect(mockProvider.onFormulaBarTextChange).toHaveBeenCalledWith('First\nSecond');
    expect(mockProvider.onFormulaBarKeyDown).not.toHaveBeenCalled();
  });

  it('keeps multiline formula input as a textbox and associates autocomplete suggestions', async () => {
    HTMLElement.prototype.scrollIntoView = jest.fn();
    rerender(
      <Provider store={store}>
        <FormulaBar
          isReadOnly={false}
          activeCellRange="A2"
          cellFormula=""
          stringCellValue={'First\nSecond'}
          multiline={true}
          onRangeInputChange={jest.fn()}
          onRangeInputKeyDown={jest.fn()}
        />
      </Provider>
    );

    const formulaInput = screen.getByRole('textbox', { name: 'Formula Bar' });
    expect(formulaInput).not.toHaveAttribute('role', 'combobox');
    expect(formulaInput).toHaveAttribute('aria-autocomplete', 'list');
    expect(formulaInput).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(formulaInput);
    const handlers = core.addEventListener.mock.calls
      .filter(([eventName]) => eventName === 'formulaSearchEvent');
    act(() => {
      handlers[handlers.length - 1][1]({
        getFormulaInfoItems: () => [{ name: 'SUM', description: 'Adds values.' }],
      });
    });
    const suggestions = await screen.findByRole('listbox', { name: 'Formulas' });
    expect(formulaInput).toHaveAttribute('aria-expanded', 'true');
    expect(formulaInput).toHaveAttribute('aria-controls', suggestions.id);
    expect(formulaInput).toHaveAttribute('aria-activedescendant', 'option-0');
  });

  it('prevents native Enter when selecting a multiline autocomplete option', async () => {
    HTMLElement.prototype.scrollIntoView = jest.fn();
    rerender(
      <Provider store={store}>
        <FormulaBar
          isReadOnly={false}
          activeCellRange="A2"
          cellFormula=""
          stringCellValue={'First\nSecond'}
          multiline={true}
          onRangeInputChange={jest.fn()}
          onRangeInputKeyDown={jest.fn()}
        />
      </Provider>
    );

    const formulaInput = screen.getByRole('textbox', { name: 'Formula Bar' });
    await userEvent.click(formulaInput);
    const handlers = core.addEventListener.mock.calls
      .filter(([eventName]) => eventName === 'formulaSearchEvent');
    act(() => {
      handlers[handlers.length - 1][1]({
        getFormulaInfoItems: () => [{ name: 'SUM', description: 'Adds values.' }],
      });
    });
    await screen.findByRole('listbox', { name: 'Formulas' });

    expect(fireEvent.keyDown(formulaInput, { key: 'Enter' })).toBe(false);
    expect(mockProvider.onFormulaBarSelectFormula).toHaveBeenCalledWith('SUM');
    expect(mockProvider.onFormulaBarTextChange).toHaveBeenCalledWith('SUM');
  });

  it('does not change the highlighted option when help is open without search results', async () => {
    HTMLElement.prototype.scrollIntoView = jest.fn();
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.click(formulaInput);
    const helpHandler = core.addEventListener.mock.calls.find(
      ([eventName]) => eventName === 'formulaHelpEvent'
    )?.[1];
    const searchHandlers = core.addEventListener.mock.calls
      .filter(([eventName]) => eventName === 'formulaSearchEvent');

    act(() => {
      helpHandler({
        getFormulaInfo: () => ({ name: 'SUM', description: 'Adds values.', parameters: [] }),
      });
    });
    fireEvent.keyDown(formulaInput, { key: 'ArrowDown' });
    expect(mockProvider.onFormulaBarKeyDown).toHaveBeenCalled();

    act(() => {
      helpHandler({ getFormulaInfo: () => null });
      searchHandlers[searchHandlers.length - 1][1]({
        getFormulaInfoItems: () => [{ name: 'SUM', description: 'Adds values.' }],
      });
    });

    await screen.findByRole('listbox', { name: 'Formulas' });
    expect(formulaInput).toHaveAttribute('aria-activedescendant', 'option-0');
  });

  it('resets expansion after a multiline value becomes single-line in the same cell', () => {
    const renderFormulaBar = (multiline, stringCellValue) => (
      <Provider store={store}>
        <FormulaBar
          isReadOnly={false}
          activeCellRange="A2"
          cellFormula=""
          stringCellValue={stringCellValue}
          multiline={multiline}
          onRangeInputChange={jest.fn()}
          onRangeInputKeyDown={jest.fn()}
        />
      </Provider>
    );

    rerender(renderFormulaBar(true, 'First\nSecond'));
    fireEvent.click(screen.getByRole('button', { name: 'Expand Formula Bar' }));
    expect(screen.getByRole('button', { name: 'Collapse Formula Bar' })).toHaveAttribute('aria-expanded', 'true');

    rerender(renderFormulaBar(false, 'Single line'));
    rerender(renderFormulaBar(true, 'First\nSecond'));
    expect(screen.getByRole('button', { name: 'Expand Formula Bar' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows an externally undone value while the formula input is focused', async () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.click(formulaInput);

    rerender(
      <Provider store={store}>
        <FormulaBar
          isReadOnly={false}
          activeCellRange="A1"
          cellFormula=""
          stringCellValue="Undone value"
          onRangeInputChange={jest.fn()}
          onRangeInputKeyDown={jest.fn()}
        />
      </Provider>
    );

    expect(formulaInput).toHaveValue('Undone value');
  });

  it('uses public segment text when the formula bar text changes', () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    const handler = core.addEventListener.mock.calls.find(
      ([eventName]) => eventName === 'formulaBarTextChangedEvent'
    )?.[1];

    fireEvent(formulaInput, new Event('focus'));
    act(() => {
      handler({
        getInfo: () => [{ text: 'Value before edit', _text: 'Value test before edit' }],
      });
    });

    expect(formulaInput).toHaveValue('Value before edit');
  });

  it('calls onFormulaBarSelectionChanged when the selection changes in the formula input', async () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    await userEvent.click(formulaInput);
    formulaInput.setSelectionRange(0, 2);
    await userEvent.type(formulaInput, '=sum');
    formulaInput.dispatchEvent(new Event('select', { bubbles: true }));
    expect(mockProvider.onFormulaBarSelectionChanged).toHaveBeenCalled();
  });

  it('allows clipboard operations by default and supports disabling and re-enabling', () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    const copyEvent = new Event('copy', { bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(copyEvent)).toBe(true);
    expect(console.warn).not.toHaveBeenCalled();
    mockSpreadsheetEditorManager.disableClipboard();
    const copyEvent2 = new Event('copy', { bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(copyEvent2)).toBe(false);
    expect(console.warn).toHaveBeenCalledWith('Clipboard operations are disabled in the formula bar.');
    mockSpreadsheetEditorManager.enableClipboard();
    const copyEvent3 = new Event('copy', { bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(copyEvent3)).toBe(true);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('blocks clipboard shortcuts when the clipboard is disabled', () => {
    mockSpreadsheetEditorManager.disableClipboard();
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    const shortcutEvent = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(shortcutEvent)).toBe(false);
    expect(console.warn).toHaveBeenCalledWith('Clipboard operations are disabled in the formula bar.');
  });

  it('blocks the context menu only when the clipboard is disabled', () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });
    const enabledContextMenuEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(enabledContextMenuEvent)).toBe(true);

    mockSpreadsheetEditorManager.disableClipboard();
    const disabledContextMenuEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(disabledContextMenuEvent)).toBe(false);
  });

  it('blocks paste operations and keyboard shortcuts when the clipboard is disabled', () => {
    const formulaInput = screen.getByRole('combobox', { name: 'Formula Bar' });

    // Paste event should be allowed by default
    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(pasteEvent)).toBe(true);
    expect(console.warn).not.toHaveBeenCalled();

    mockSpreadsheetEditorManager.disableClipboard();

    // Paste event should be blocked when disabled
    const pasteEvent2 = new Event('paste', { bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(pasteEvent2)).toBe(false);
    expect(console.warn).toHaveBeenCalledWith('Clipboard operations are disabled in the formula bar.');

    // Ctrl+V shortcut should be blocked when disabled
    const ctrlVShortcut = new KeyboardEvent('keydown', { key: 'v', ctrlKey: true, bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(ctrlVShortcut)).toBe(false);

    // Shift+Insert shortcut should be blocked when disabled
    const shiftInsertShortcut = new KeyboardEvent('keydown', { key: 'Insert', shiftKey: true, bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(shiftInsertShortcut)).toBe(false);

    mockSpreadsheetEditorManager.enableClipboard();

    // Paste event should be allowed again after re-enabling
    const pasteEvent3 = new Event('paste', { bubbles: true, cancelable: true });
    expect(formulaInput.dispatchEvent(pasteEvent3)).toBe(true);
    expect(console.warn).toHaveBeenCalledTimes(3); // paste event + Ctrl+V + Shift+Insert
  });

  describe('formula overlay keyboard navigation', () => {
    const formulas = [
      { name: 'SUM', description: 'Adds numbers' },
      { name: 'AVERAGE', description: 'Averages numbers' },
      { name: 'COUNT', description: 'Counts numbers' },
    ];
    const getFormulaInput = () => screen.getByRole('combobox', { name: 'Formula Bar' });
    const getOptions = () => screen.getAllByRole('option');
    const getHighlightedOptionIndex = () =>
      getOptions().findIndex((option) => option.getAttribute('aria-selected') === 'true');

    const openOverlay = async (items = formulas) => {
      const formulaInput = getFormulaInput();
      await userEvent.click(formulaInput);

      // The handler is re-registered once the input is focused, so use the most recent registration.
      const searchHandlers = core.addEventListener.mock.calls
        .filter(([eventName]) => eventName === 'formulaSearchEvent')
        .map(([, handler]) => handler);
      const latestSearchHandler = searchHandlers[searchHandlers.length - 1];
      act(() => {
        latestSearchHandler({ getFormulaInfoItems: () => items });
      });
      return formulaInput;
    };

    beforeEach(() => {
      // jsdom does not implement scrollIntoView, which FormulaOverlay calls when the highlight changes.
      // The top-level afterEach restores it.
      HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    it('highlights the first formula when the overlay opens', async () => {
      await openOverlay();

      expect(getOptions()).toHaveLength(formulas.length);
      expect(getHighlightedOptionIndex()).toBe(0);
    });

    it('moves the highlight down with ArrowDown and wraps to the first formula', async () => {
      const formulaInput = await openOverlay();

      fireEvent.keyDown(formulaInput, { key: 'ArrowDown' });
      expect(getHighlightedOptionIndex()).toBe(1);

      fireEvent.keyDown(formulaInput, { key: 'ArrowDown' });
      fireEvent.keyDown(formulaInput, { key: 'ArrowDown' });
      expect(getHighlightedOptionIndex()).toBe(0);
    });

    it('moves the highlight up with ArrowUp and wraps to the last formula', async () => {
      const formulaInput = await openOverlay();

      fireEvent.keyDown(formulaInput, { key: 'ArrowUp' });
      expect(getHighlightedOptionIndex()).toBe(formulas.length - 1);

      fireEvent.keyDown(formulaInput, { key: 'ArrowUp' });
      expect(getHighlightedOptionIndex()).toBe(formulas.length - 2);
    });

    it('accumulates arrow key presses handled in the same React batch', async () => {
      const formulaInput = await openOverlay();

      act(() => {
        fireEvent.keyDown(formulaInput, { key: 'ArrowDown' });
        fireEvent.keyDown(formulaInput, { key: 'ArrowDown' });
      });
      expect(getHighlightedOptionIndex()).toBe(2);

      act(() => {
        fireEvent.keyDown(formulaInput, { key: 'ArrowUp' });
        fireEvent.keyDown(formulaInput, { key: 'ArrowUp' });
      });
      expect(getHighlightedOptionIndex()).toBe(0);
    });

    it('selects the highlighted formula on Enter', async () => {
      const formulaInput = await openOverlay();

      fireEvent.keyDown(formulaInput, { key: 'ArrowDown' });
      fireEvent.keyDown(formulaInput, { key: 'Enter' });

      expect(mockProvider.onFormulaBarSelectFormula).toHaveBeenCalledTimes(1);
      expect(mockProvider.onFormulaBarSelectFormula).toHaveBeenCalledWith('AVERAGE');
    });

    it('selects the highlighted formula on Tab and keeps focus in the formula bar', async () => {
      const formulaInput = await openOverlay();

      fireEvent.keyDown(formulaInput, { key: 'ArrowDown' });
      const tabAllowedDefault = fireEvent.keyDown(formulaInput, { key: 'Tab' });

      expect(mockProvider.onFormulaBarSelectFormula).toHaveBeenCalledWith('AVERAGE');
      expect(tabAllowedDefault).toBe(false);
    });

    it('does not select a formula on Shift+Tab', async () => {
      const formulaInput = await openOverlay();

      const shiftTabAllowedDefault = fireEvent.keyDown(formulaInput, { key: 'Tab', shiftKey: true });

      expect(mockProvider.onFormulaBarSelectFormula).not.toHaveBeenCalled();
      expect(shiftTabAllowedDefault).toBe(true);
    });

    it('closes the overlay without selecting a formula on Escape', async () => {
      const formulaInput = await openOverlay();
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(formulaInput, { key: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(mockProvider.onFormulaBarSelectFormula).not.toHaveBeenCalled();
    });

    it('does not select a formula on Enter when there are no search results', async () => {
      const formulaInput = await openOverlay([]);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      fireEvent.keyDown(formulaInput, { key: 'Enter' });

      expect(mockProvider.onFormulaBarSelectFormula).not.toHaveBeenCalled();
    });

    it('passes regular typing through to the provider while the overlay is open', async () => {
      const formulaInput = await openOverlay();

      fireEvent.keyDown(formulaInput, { key: 'x' });

      expect(mockProvider.onFormulaBarKeyDown).toHaveBeenCalled();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });
});
