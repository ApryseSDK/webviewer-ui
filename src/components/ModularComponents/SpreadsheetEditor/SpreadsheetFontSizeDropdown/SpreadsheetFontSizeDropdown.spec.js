import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Basic as SpreadsheetFontSizeDropdownStory } from './SpreadsheetFontSizeDropdown.stories';
import * as setCellFontStyleModule from 'src/helpers/setCellFontStyle';

jest.mock('src/helpers/setCellFontStyle', () => jest.fn());

describe('SpreadsheetFontSizeDropdown', () => {
  it('renders the storybook component correctly', () => {
    expect(() => {
      render(<SpreadsheetFontSizeDropdownStory />);
    }).not.toThrow();
  });

  it('should not show size options by default', () => {
    render(<SpreadsheetFontSizeDropdownStory />);
    const fontSizes = screen.getByRole('listbox');
    expect(fontSizes).toHaveClass('hide');
  });

  it('should call setCellFontStyle when a size is selected', async () => {
    render(<SpreadsheetFontSizeDropdownStory />);

    const fontSizeCombobox = screen.getByRole('combobox');
    userEvent.click(fontSizeCombobox);

    const fontSizes = screen.getByRole('listbox');
    expect(fontSizes).toBeInTheDocument();
    expect(fontSizes).not.toHaveClass('hide');
    expect(fontSizeCombobox).toBeInTheDocument();
    expect(fontSizeCombobox.getAttribute('aria-expanded')).toEqual('true');

    const option12 = screen.getByRole('option', { name: '12' });
    userEvent.click(option12);

    expect(setCellFontStyleModule.default).toHaveBeenCalled();
    expect(setCellFontStyleModule.default).toHaveBeenCalledWith({ pointSize: 12 });
  });
});