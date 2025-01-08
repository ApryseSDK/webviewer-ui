import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Basic as BasicStory, DropdownWithInput, DropdownWithInputAndNoSearch, ImageDropdown } from './Dropdown.stories';
import userEvent from '@testing-library/user-event';

// wrap component with i18n provider, so component can use useTranslation()
const DropdownStory = withI18n(BasicStory);

const DropdownWithInputStory = withI18n(DropdownWithInput);

describe('Dropdown component', () => {
  it('Should select item correctly', () => {
    render(<DropdownStory />);

    // make sure dropdown items are hidden
    let dropdownItems = screen.getByRole('listbox');
    expect(dropdownItems).toHaveClass('hide');

    // make sure Position item is selected by default
    const dropDownCombobox = screen.getByRole('combobox');
    expect(dropDownCombobox).toHaveTextContent('Position');

    // click to open dropdown menu
    expect(dropDownCombobox.getAttribute('aria-expanded')).toEqual('false');
    userEvent.click(dropDownCombobox);

    // make sure dropdown menu is open
    dropdownItems = screen.getByRole('listbox');
    expect(dropdownItems).toBeInTheDocument();
    expect(dropdownItems).not.toHaveClass('hide');

    expect(dropDownCombobox).toBeInTheDocument();
    expect(dropDownCombobox.getAttribute('aria-expanded')).toEqual('true');

    // click Status button and make sure active element is changed to Status
    const statusOption = screen.getByRole('option', { name: 'Status' });
    userEvent.click(statusOption);
    expect(dropDownCombobox).toHaveTextContent('Status');
  });
});

describe('Dropdown component with input', () => {
  it('Should select item correctly when typing', () => {
    render(<DropdownWithInputStory />);

    //find the combobox and open it with enter
    const dropDownCombobox = screen.getByRole('combobox');
    userEvent.click(dropDownCombobox);

    // find the input field
    const inputField = screen.getAllByRole('combobox')[1];

    //check the value
    expect(inputField).toHaveValue('Argentina');

    // type in the input field MEX
    userEvent.type(inputField, 'MEX');

    //Now assert the options filtered down to one
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);

    // now press enter to select the option
    userEvent.type(inputField, '{enter}');
    expect(dropDownCombobox).toHaveTextContent('Mexico');
  });

  it('should allow you to select an item using the keyboard', () => {
    render(<DropdownWithInputStory />);

    //find the combobox and open it with enter
    const dropDownCombobox = screen.getByRole('combobox');
    userEvent.click(dropDownCombobox);

    // find the input field
    const inputField = screen.getAllByRole('combobox')[1];

    //check the value
    expect(inputField).toHaveValue('Argentina');

    // Arrow down five times
    userEvent.type(inputField, '{arrowdown}');
    userEvent.type(inputField, '{arrowdown}');
    userEvent.type(inputField, '{arrowdown}');
    userEvent.type(inputField, '{arrowdown}');
    userEvent.type(inputField, '{arrowdown}');

    // now press enter to select the option
    userEvent.type(inputField, '{enter}');
    expect(dropDownCombobox).toHaveTextContent('Canada');
  });

  it('should allow you filter correctly as I clear my input', () => {
    render(<DropdownWithInputStory />);
    //find the combobox and open it with enter
    const dropDownCombobox = screen.getByRole('combobox');
    userEvent.click(dropDownCombobox);

    // find the input field
    const inputField = screen.getAllByRole('combobox')[1];

    //check the value
    expect(inputField).toHaveValue('Argentina');

    // type in the input field MEX
    userEvent.type(inputField, 'MEX');

    //Now assert the options filtered down to one
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);

    // clear the input field
    userEvent.clear(inputField);

    //Now all the countries should be visible
    const allOptions = screen.getAllByRole('option');
    expect(allOptions).toHaveLength(51);
  });

  it('should not select if I press ESC', async () => {
    render(<DropdownWithInputStory />);

    //find the combobox and open it with enter
    const dropDownCombobox = screen.getByRole('combobox');
    //check the value
    expect(dropDownCombobox).toHaveTextContent('Argentina');
    userEvent.click(dropDownCombobox);

    // find the input field
    const inputField = screen.getAllByRole('combobox')[1];

    //check the value
    expect(inputField).toHaveValue('Argentina');

    // Arrow down five times
    userEvent.type(inputField, '{arrowdown}');
    userEvent.type(inputField, '{arrowdown}');
    userEvent.type(inputField, '{arrowdown}');
    userEvent.type(inputField, '{arrowdown}');
    userEvent.type(inputField, '{arrowdown}');

    // now press esc which should close the dropdown and make no selection
    userEvent.type(inputField, '{esc}');
    expect(dropDownCombobox).toHaveTextContent('Argentina');
  });
});

describe('Dropdown component with font sizes', () => {
  it('renders the default font and allows me to choose one with they keyboard', () => {
    render(<DropdownWithInputAndNoSearch />);

    const dropDownCombobox = screen.getByRole('combobox');
    userEvent.click(dropDownCombobox);

    const inputField = screen.getAllByRole('combobox')[1];
    expect(inputField).toHaveValue('11');

    // Arrow down two times
    userEvent.type(inputField, '{arrowdown}');
    userEvent.type(inputField, '{arrowdown}');

    userEvent.type(inputField, '{enter}');
    expect(dropDownCombobox).toHaveTextContent('14');
  });

  it('Allows me to type a font size not in the dropdown', () => {
    render(<DropdownWithInputAndNoSearch />);

    const dropDownCombobox = screen.getByRole('combobox');
    userEvent.click(dropDownCombobox);

    const inputField = screen.getAllByRole('combobox')[1];
    expect(inputField).toHaveValue('11');

    userEvent.type(inputField, '13');
    // No filtering happened, so the dropdown should still have all the options
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(13);

    userEvent.type(inputField, '{enter}');
    expect(dropDownCombobox).toHaveTextContent('13');

    //and no errors should be thrown if I reopen the dropdown
    userEvent.click(dropDownCombobox);
  });

  it('makes active the item that matches the input if it exists in the list', () => {
    render(<DropdownWithInputAndNoSearch />);

    const dropDownCombobox = screen.getByRole('combobox');
    userEvent.click(dropDownCombobox);

    const inputField = screen.getAllByRole('combobox')[1];
    expect(inputField).toHaveValue('11');

    // the active option should be 11
    expect(screen.getByRole('option', { name: '11' })).toHaveClass('active');
    // and also the selected option
    expect(screen.getByRole('option', { name: '11' })).toHaveAttribute('aria-selected', 'true');

    //and if I arrow down to 12, 11 should no longer be active
    userEvent.type(inputField, '{arrowdown}');
    expect(screen.getByRole('option', { name: '11' })).not.toHaveClass('active');
    // but should still be active
    expect(screen.getByRole('option', { name: '11' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('Dropdown with images', () => {
  it('should change the activeDescendent correctly for image dropdowns', () => {
    render(<ImageDropdown />);

    const dropDownCombobox = screen.getByRole('combobox');
    // Open it
    userEvent.type(dropDownCombobox, '{Enter}');
    expect(dropDownCombobox.getAttribute('aria-expanded')).toEqual('true');
    expect(screen.getByRole('option', { name: 'None' })).toHaveClass('active');

    //There should be 4 options, and they all should have accessible labels
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);

    // Now check all have labels
    screen.getByRole('option', { name: 'None' });
    screen.getByRole('option', { name: 'ClosedArrow' });
    screen.getByRole('option', { name: 'OpenArrow' });
    screen.getByRole('option', { name: 'ROpenArrow' });

    // Arrow down two times so OpenArrow is active
    fireEvent.keyDown(dropDownCombobox, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(dropDownCombobox, { key: 'ArrowDown', code: 'ArrowDown' });

    // Open arrow should be active
    expect(screen.getByRole('option', { name: 'OpenArrow' })).toHaveClass('active');

    // Check active descendent is correct as OpenArrow
    expect(dropDownCombobox).toHaveAttribute('aria-activedescendant', 'image-dropdown-story-OpenArrow');
  });
});