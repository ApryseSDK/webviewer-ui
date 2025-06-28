import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Basic as SpreadsheetFontFamilyDropdownStory } from './SpreadsheetFontFamilyDropdown.stories';
import * as setCellFontStyleModule from 'src/helpers/setCellFontStyle';

jest.mock('src/helpers/setCellFontStyle', () => jest.fn());

describe('SpreadsheetFontFamilyDropdown', () => {
  it('renders the storybook component correctly', () => {
    expect(() => {
      render(<SpreadsheetFontFamilyDropdownStory />);
    }).not.toThrow();
  });

  it('should not show font family options by default', () => {
    render(<SpreadsheetFontFamilyDropdownStory />);
    const fontFamilies = screen.getByRole('listbox');
    expect(fontFamilies).toHaveClass('hide');
  });

  it('should call setCellFontStyle when a font family is selected', async () => {
    render(<SpreadsheetFontFamilyDropdownStory />);

    const fontFamilyCombobox = screen.getByRole('combobox');
    userEvent.click(fontFamilyCombobox);

    const fontFamilies = screen.getByRole('listbox');
    expect(fontFamilies).toBeInTheDocument();
    expect(fontFamilies).not.toHaveClass('hide');
    expect(fontFamilyCombobox).toBeInTheDocument();
    expect(fontFamilyCombobox.getAttribute('aria-expanded')).toEqual('true');

    const calibriOption = screen.getByRole('option', { name: 'Calibri' });
    userEvent.click(calibriOption);

    expect(setCellFontStyleModule.default).toHaveBeenCalled();
    expect(setCellFontStyleModule.default).toHaveBeenCalledWith({ fontFace: 'Calibri' });
  });
});