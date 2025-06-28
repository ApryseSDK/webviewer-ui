import React from 'react';
import { render, screen } from '@testing-library/react';
import { Basic as StoryBookCellTextColor } from './CellTextColor.stories';
import userEvent from '@testing-library/user-event';
import * as setCellFontStyleModule from 'src/helpers/setCellFontStyle';

jest.mock('src/helpers/setCellFontStyle', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('CellTextColor', () => {
  it('renders the storybook component correctly', () => {
    expect(() => {
      render(<StoryBookCellTextColor />);
    }).not.toThrow();
  });

  it('should call setCellFontStyle when a color is selected', async () => {
    render(<StoryBookCellTextColor />);
    // eslint-disable-next-line custom/no-hex-colors
    const colorPicker = screen.getByRole('button', { name: 'Text Color #E44234' });
    expect(colorPicker).toBeInTheDocument();

    userEvent.click(colorPicker);

    expect(setCellFontStyleModule.default).toHaveBeenCalled();
    expect(setCellFontStyleModule.default).toHaveBeenCalledWith({ color: { 'A': 1, 'B': 52, 'G': 66, 'R': 228 } });
  });

  it('should call setCellFontStyle when the "Reset to Default" button is clicked', async () => {
    render(<StoryBookCellTextColor />);
    const resetButton = screen.getByRole('button', { name: 'Reset to default' });
    expect(resetButton).toBeInTheDocument();

    userEvent.click(resetButton);

    expect(setCellFontStyleModule.default).toHaveBeenCalled();
    expect(setCellFontStyleModule.default).toHaveBeenCalledWith({ color: { 'A': 1, 'B': 0, 'G': 0, 'R': 0 } });
  });

  it('should not be able to delete the default color', async () => {
    render(<StoryBookCellTextColor />);
    // eslint-disable-next-line custom/no-hex-colors
    const defaultColorButton = screen.getByRole('button', { name: 'Text Color #000000' });
    expect(defaultColorButton).toBeInTheDocument();

    userEvent.click(defaultColorButton);

    const deleteButton = screen.getByRole('button', { name: 'Delete Selected Color rgba(0,0,0,1)' });
    expect(deleteButton).toBeDisabled();
  });
});