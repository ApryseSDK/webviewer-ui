import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BASIC_PALETTE } from 'constants/commonColors';
import ColorPalette from './ColorPalette';

const ColorPaletteWithProviders = withProviders(ColorPalette);
const customColors = ['000000', 'FFFFFF'];

const DEFAULT_GRID_COLS = 7;
const DEFAULT_GRID_ROWS = Math.ceil(BASIC_PALETTE.length / DEFAULT_GRID_COLS);

const UNBALANCED_PALETTE = BASIC_PALETTE.slice(0, BASIC_PALETTE.length - 3); // Remove 3 colors to create an unbalanced grid

const cellAt = (buttons, rowIndex, colIndex) => buttons[rowIndex * DEFAULT_GRID_COLS + colIndex];
const getColorButtons = () => screen.getAllByRole('button', { name: /Color / }); // Default translation prefixes all color buttons with "Color"

function noop() {}

describe('ColorPalette', () => {
  it('Component should not throw any errors', () => {
    expect(() => {
      render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);
    }).not.toThrow();
  });

  it('Component should have a Color Aria Label', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);
    const element = screen.getByLabelText(`Color #${customColors[0]}`);

    expect(element).toBeInTheDocument();
  });

  it('Should have aria-current attribute', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);
    const element = screen.getByLabelText(`Color #${customColors[0]}`);

    expect(element).toHaveAttribute('aria-current');
  });

  it('should render the correct number of color buttons by default', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);

    const colorButtons = getColorButtons();
    expect(colorButtons.length).toBe(BASIC_PALETTE.length);
  });

  it('should filter out transparency from the palette when using the TextColor property', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={'TextColor'}/>);
    const colorButtons = getColorButtons();
    expect(colorButtons.length).toBe(BASIC_PALETTE.length - 1);
  });

  it('should filter out transparency from the palette when using the StrokeColor property', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={'StrokeColor'}/>);
    const colorButtons = getColorButtons();
    expect(colorButtons.length).toBe(BASIC_PALETTE.length - 1);
  });

  it('should set current Color on enter key press', () => {
    const onStyleChangeMock = jest.fn();
    const expectedColor = new window.Core.Annotations.Color(`#${customColors[0]}`);
    render(<ColorPaletteWithProviders onStyleChange={onStyleChangeMock} property={''}/>);

    const colorButton = screen.getByLabelText(`Color #${customColors[0]}`);
    colorButton.focus();
    expect(colorButton).toHaveFocus();

    fireEvent.keyDown(colorButton, { key: 'Enter' });
    expect(onStyleChangeMock).toHaveBeenCalledTimes(1);
    expect(onStyleChangeMock).toHaveBeenCalledWith('', expectedColor);
  });

  it('should focus active color button on mount', () => {
    const expectedColor = new window.Core.Annotations.Color(`#${customColors[1]}`);
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''} color={expectedColor} hasInitialFocus={true}/>);

    const colorButton = screen.getByLabelText(`Color #${customColors[1]}`);
    expect(colorButton).toHaveFocus();
    expect(colorButton).toHaveAttribute('aria-current', 'true');
  });

  it('should be navigable with keyboard', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);

    const colorButtons = getColorButtons();

    const firstButton = cellAt(colorButtons, 0, 0);
    firstButton.focus();
    expect(firstButton).toHaveFocus();

    // Simulate arrow key navigation
    fireEvent.keyDown(firstButton, { key: 'ArrowRight' });
    expect(cellAt(colorButtons, 0, 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, 0, 1), { key: 'ArrowDown' });
    expect(cellAt(colorButtons, 1, 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, 1, 1), { key: 'ArrowLeft' });
    expect(cellAt(colorButtons, 1, 0)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, 1, 0), { key: 'ArrowUp' });
    expect(cellAt(colorButtons, 0, 0)).toHaveFocus();
  });

  it('should overflow correctly with a balanced grid when navigating with keyboard', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);
    const colorButtons = getColorButtons();
    expect(colorButtons.length % DEFAULT_GRID_COLS).toBe(0);

    // Indices are 0-based, so the last column index is DEFAULT - 1
    const firstButton = cellAt(colorButtons, 0, 0);
    firstButton.focus();
    expect(firstButton).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, 0, 0), { key: 'ArrowLeft' });
    expect(cellAt(colorButtons, 0, DEFAULT_GRID_COLS - 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, 0, DEFAULT_GRID_COLS - 1), { key: 'ArrowUp' });
    expect(cellAt(colorButtons, DEFAULT_GRID_ROWS - 1, DEFAULT_GRID_COLS - 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, DEFAULT_GRID_ROWS - 1, DEFAULT_GRID_COLS - 1), { key: 'ArrowRight' });
    expect(cellAt(colorButtons, DEFAULT_GRID_ROWS - 1, 0)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, DEFAULT_GRID_ROWS - 1, 0), { key: 'ArrowDown' });
    expect(cellAt(colorButtons, 0, 0)).toHaveFocus();
  });

  it('should overflow correctly with an unbalanced grid when navigating with keyboard', () => {
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''} overridePalette2={UNBALANCED_PALETTE} />);
    const colorButtons = getColorButtons();
    expect(colorButtons.length % DEFAULT_GRID_COLS).toBeGreaterThan(0);
    const incompleteRowColumnCount = colorButtons.length % DEFAULT_GRID_COLS;
    const numOfCompleteRows = Math.floor(colorButtons.length / DEFAULT_GRID_COLS);
    const totalRows = Math.ceil(colorButtons.length / DEFAULT_GRID_COLS);

    // Indices are 0-based, so the last column/row index is DEFAULT - 1
    const firstButton = cellAt(colorButtons, 0, 0);
    firstButton.focus();
    expect(firstButton).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, 0, 0), { key: 'ArrowLeft' });
    expect(cellAt(colorButtons, 0, DEFAULT_GRID_COLS - 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, 0, DEFAULT_GRID_COLS - 1), { key: 'ArrowUp' });
    expect(cellAt(colorButtons, numOfCompleteRows - 1, DEFAULT_GRID_COLS - 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, numOfCompleteRows - 1, DEFAULT_GRID_COLS - 1), { key: 'ArrowRight' });
    expect(cellAt(colorButtons, numOfCompleteRows - 1, 0)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, numOfCompleteRows - 1, 0), { key: 'ArrowDown' });
    expect(cellAt(colorButtons, totalRows - 1, 0)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, totalRows - 1, 0), { key: 'ArrowLeft' });
    expect(cellAt(colorButtons, totalRows - 1, incompleteRowColumnCount - 1)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, totalRows - 1, incompleteRowColumnCount - 1), { key: 'ArrowRight' });
    expect(cellAt(colorButtons, totalRows - 1, 0)).toHaveFocus();

    fireEvent.keyDown(cellAt(colorButtons, totalRows - 1, 0), { key: 'ArrowDown' });
    expect(cellAt(colorButtons, 0, 0)).toHaveFocus();
  });

  it('should call onClose when Escape key is pressed', () => {
    const onCloseMock = jest.fn();
    render(<ColorPaletteWithProviders onStyleChange={noop} property={''} onClose={onCloseMock}/>);
    const colorButton = screen.getByLabelText(`Color #${customColors[0]}`);
    colorButton.focus();
    expect(colorButton).toHaveFocus();

    fireEvent.keyDown(colorButton, { key: 'Escape' });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  describe('reset to default button navigation', () => {
    const getResetButton = () => screen.getByRole('button', { name: 'Reset to default' });

    it('should not render the reset button when onDefaultColorReset is not provided', () => {
      render(<ColorPaletteWithProviders onStyleChange={noop} property={''}/>);

      expect(screen.queryByRole('button', { name: 'Reset to default' })).not.toBeInTheDocument();
    });

    it('should move focus from the top swatch row to the reset button on ArrowUp', () => {
      render(<ColorPaletteWithProviders onStyleChange={noop} property={''} onDefaultColorReset={noop}/>);
      const colorButtons = getColorButtons();

      const topRowButton = cellAt(colorButtons, 0, 0);
      topRowButton.focus();
      expect(topRowButton).toHaveFocus();

      fireEvent.keyDown(topRowButton, { key: 'ArrowUp' });
      expect(getResetButton()).toHaveFocus();
    });

    it('should move focus from the bottom swatch row to the reset button on ArrowDown', () => {
      render(<ColorPaletteWithProviders onStyleChange={noop} property={''} onDefaultColorReset={noop}/>);
      const colorButtons = getColorButtons();

      const bottomRowButton = cellAt(colorButtons, DEFAULT_GRID_ROWS - 1, 0);
      bottomRowButton.focus();
      expect(bottomRowButton).toHaveFocus();

      fireEvent.keyDown(bottomRowButton, { key: 'ArrowDown' });
      expect(getResetButton()).toHaveFocus();
    });

    it('should move focus from the reset button to the first swatch on ArrowDown', () => {
      render(<ColorPaletteWithProviders onStyleChange={noop} property={''} onDefaultColorReset={noop}/>);
      const colorButtons = getColorButtons();

      const resetButton = getResetButton();
      resetButton.focus();
      expect(resetButton).toHaveFocus();

      fireEvent.keyDown(resetButton, { key: 'ArrowDown' });
      expect(cellAt(colorButtons, 0, 0)).toHaveFocus();
    });

    it('should move focus from the reset button to the last swatch on ArrowUp', () => {
      render(<ColorPaletteWithProviders onStyleChange={noop} property={''} onDefaultColorReset={noop}/>);
      const colorButtons = getColorButtons();

      const resetButton = getResetButton();
      resetButton.focus();
      expect(resetButton).toHaveFocus();

      fireEvent.keyDown(resetButton, { key: 'ArrowUp' });
      expect(colorButtons[colorButtons.length - 1]).toHaveFocus();
    });

    it('should call onDefaultColorReset when the reset button is clicked', () => {
      const onDefaultColorResetMock = jest.fn();
      render(<ColorPaletteWithProviders onStyleChange={noop} property={''} onDefaultColorReset={onDefaultColorResetMock}/>);

      fireEvent.click(getResetButton());
      expect(onDefaultColorResetMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape or Tab is pressed on the reset button', () => {
      const onCloseMock = jest.fn();
      render(<ColorPaletteWithProviders onStyleChange={noop} property={''} onDefaultColorReset={noop} onClose={onCloseMock}/>);

      const resetButton = getResetButton();
      resetButton.focus();
      expect(resetButton).toHaveFocus();

      fireEvent.keyDown(resetButton, { key: 'Escape' });
      fireEvent.keyDown(resetButton, { key: 'Tab' });
      expect(onCloseMock).toHaveBeenCalledTimes(2);
    });
  });
});
