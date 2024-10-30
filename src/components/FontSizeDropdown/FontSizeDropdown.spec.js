import React from 'react';
import FontSizeDropdown from 'components/FontSizeDropdown';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const noop = () => { };

jest.mock('core', () => ({
  getContentEditManager: () => ({
    isInContentEditMode: () => false,
  }),
  getDocumentViewer: () => ({}),
  getScrollViewElement: () => ({
    getBoundingClientRect: () => ({}),
  }),
}));

describe('FontSizeDropdown component', () => {
  it('Should select items and input correctly', () => {
    const mockOnFontSizeChange = jest.fn();
    render(<FontSizeDropdown onFontSizeChange={mockOnFontSizeChange} />);

    // make sure dropdown items are hidden
    const listBox = screen.getByRole('listbox');
    expect(listBox).toHaveClass('hide');

    // When we click on the combobox it creates an input, which is also a combobox
    const comboBox = screen.getByRole('combobox');
    expect(comboBox).toHaveTextContent('12');
    userEvent.click(comboBox);


    //The input should have the same value as the combobox
    const input = screen.getAllByRole('combobox')[1];
    expect(input.value).toBe('12');

    // We should have 150 options and the listbox is now visible
    expect(listBox).not.toHaveClass('hide');
    const options = screen.getAllByRole('option');
    expect(options.length).toEqual(150);
    // Type in the input field 30
    userEvent.type(input, '30');
    userEvent.type(input, '{enter}');

    // and our mock got called with 30pt as a string
    expect(mockOnFontSizeChange).toHaveBeenCalledWith('30pt');
  });
  it('Should render the correct amount of items', () => {
    const items = 5;
    render(<FontSizeDropdown onFontSizeChange={noop} maxFontSize={items} incrementMap={{ 0: 1 }} />);

    const comboBox = screen.getByRole('combobox');
    userEvent.click(comboBox);

    const options = screen.getAllByRole('option');
    expect(options.length).toEqual(items);

  });
  it('Should account for increment map correctly', () => {
    render(<FontSizeDropdown onFontSizeChange={noop} fontSize={1} maxFontSize={200} incrementMap={{ 0: 1, 10: 10, 100: 100 }} />);

    const comboBox = screen.getByRole('combobox');
    userEvent.click(comboBox);

    const options = screen.getAllByRole('option');
    expect(options.length).toEqual(20);
  });
});