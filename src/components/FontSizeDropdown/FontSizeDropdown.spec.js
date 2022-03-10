import React from "react";
import FontSizeDropdown from "components/FontSizeDropdown";
import { fireEvent, render } from '@testing-library/react';

const noop = () => {};

describe('FontSizeDropdown component', () => {
  it('Should select items and input correctly', () => {
    const { container } = render(<FontSizeDropdown onFontSizeChange={noop}/>);

    // make sure dropdown items are hidden
    let dropdownItems = container.querySelector('.Dropdown__items');
    expect(dropdownItems).toBeInTheDocument();
    expect(dropdownItems).toHaveClass('hidden');

    // Make sure input value converts on focus
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('12pt');
    input.focus();
    expect(input.value).toBe('12');

    // click to open dropdown menu
    const iconButton = container.querySelector('.icon-button');
    expect(iconButton).toBeInTheDocument();
    fireEvent.click(iconButton);

    // make sure dropdown menu is open
    dropdownItems = container.querySelector('.Dropdown__items');
    expect(dropdownItems).toBeInTheDocument();
    expect(dropdownItems).not.toHaveClass('hidden');
  });
  it('Should call handler on value change', () => {
    const handler = jest.fn();
    const { container } = render(<FontSizeDropdown onFontSizeChange={handler}/>);

    const input = container.querySelector('input');
    fireEvent.change(input, { target: { value: "34" } });

    // click to open dropdown menu
    const iconButton = container.querySelector('.icon-button');
    fireEvent.click(iconButton);
    const dropdownItems = container.querySelector('.Dropdown__items');
    fireEvent.click(dropdownItems.childNodes[0]);

    expect(handler).toHaveBeenCalledTimes(2);
  });
  it('Should render the correct amount of items', () => {
    const items = 5;
    const { container } = render(<FontSizeDropdown onFontSizeChange={noop} maxFontSize={items} incrementMap={{ 0: 1 }}/>);

    const iconButton = container.querySelector('.icon-button');
    fireEvent.click(iconButton);

    const dropdownItems = container.querySelector('.Dropdown__items');
    expect(dropdownItems.childNodes.length).toBe(items);
  });
  it('Should account for increment map correctly', () => {
    const { container } = render(<FontSizeDropdown onFontSizeChange={noop} fontSize={1} maxFontSize={200} incrementMap={{ 0: 1, 10: 10, 100: 100 }}/>);

    const iconButton = container.querySelector('.icon-button');
    fireEvent.click(iconButton);

    const dropdownItems = container.querySelector('.Dropdown__items');
    expect(dropdownItems.childNodes.length).toBe(20);
  });

});