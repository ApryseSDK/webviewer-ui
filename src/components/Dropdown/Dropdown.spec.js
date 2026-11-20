import React from 'react';
import { TOOLTIP_SHOW_DELAY } from 'constants/tooltip';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Dropdown from './Dropdown';
import Icon from 'components/Icon';
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
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('translates icon-only tooltips without changing option names and removes them on dismissal', () => {
    const DropdownWithProviders = withProviders(Dropdown);
    const { unmount } = render(
      <DropdownWithProviders id="icon-options" images={[{ key: 'save', src: 'icon-save', title: 'action.save' }]} />
    );
    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { key: 'Enter' });
    const option = screen.getByRole('option');
    expect(option).toHaveAttribute('aria-label', 'action.save');
    fireEvent.focus(option);
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
    fireEvent.keyDown(combobox, { key: 'Escape' });
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
    unmount();
  });

  it('describes the active icon during arrow navigation and hides the tooltip after selection', () => {
    const onClickItem = jest.fn();
    const DropdownWithProviders = withProviders(Dropdown);
    render(<DropdownWithProviders id="keyboard-icons" currentSelectionKey="save" onClickItem={onClickItem} images={[
      { key: 'save', src: 'icon-save', title: 'action.save' },
      { key: 'print', src: 'icon-header-print', title: 'action.print' },
    ]} />);
    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { key: 'Enter' });
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Print');
    fireEvent.keyDown(combobox, { key: 'Enter' });
    expect(onClickItem).toHaveBeenCalledWith('print', 1);
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

  it('replaces the previous tooltip when hovering an option underneath it', () => {
    const DropdownWithProviders = withProviders(Dropdown);
    render(<DropdownWithProviders id="overlapping-icons" images={[
      { key: 'save', src: 'icon-save', title: 'action.save' },
      { key: 'print', src: 'icon-header-print', title: 'action.print' },
    ]} />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    const saveOption = screen.getByRole('option', { name: 'action.save' });
    const printOption = screen.getByRole('option', { name: 'action.print' });
    fireEvent(saveOption, new MouseEvent('pointermove', { bubbles: true, clientX: 40, clientY: 10 }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    const originalTooltip = document.querySelector('[data-element="tooltip"]');
    expect(originalTooltip).toHaveTextContent('Save');
    jest.spyOn(originalTooltip, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 100, top: 20, bottom: 100, width: 100, height: 80 });
    fireEvent(printOption, new MouseEvent('pointermove', { bubbles: true, clientX: 40, clientY: 50 }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelectorAll('[data-element="tooltip"]')).toHaveLength(1);
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Print');
  });

  it.each([
    { images: [{ key: 'save', src: 'icon-save', title: 'Save' }] },
    { items: ['Save'] },
  ])('keeps focus on the combobox when keyboard navigation is dismissed with Escape: %j', (optionProps) => {
    const DropdownWithProviders = withProviders(Dropdown);
    render(<DropdownWithProviders id="escape-options" {...optionProps} />);
    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { key: 'Enter' });
    expect(combobox).toHaveFocus();
    fireEvent.keyDown(combobox, { key: 'Escape' });
    expect(combobox).toHaveFocus();
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

  it('does not show a redundant tooltip for image options rendered as text', () => {
    const DropdownWithProviders = withProviders(Dropdown);
    render(<DropdownWithProviders id="text-options" images={[{ key: 'save', title: 'Save' }]} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    fireEvent.focus(screen.getByRole('option', { name: 'Save' }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

  it('preserves the flyout Tab handler on the combobox', () => {
    const onKeyDownHandler = jest.fn((event) => event.preventDefault());
    const DropdownWithProviders = withProviders(Dropdown);
    render(<DropdownWithProviders id="flyout-tab-options" items={['Save']} isFlyoutItem onKeyDownHandler={onKeyDownHandler} />);
    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { key: 'Enter' });
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    fireEvent(combobox, event);
    expect(onKeyDownHandler).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
    expect(combobox).toHaveFocus();
  });

  it('does not automatically show option tooltips when opening or reopening by mouse', () => {
    const DropdownWithProviders = withProviders(Dropdown);
    render(<DropdownWithProviders id="mouse-icons" currentSelectionKey="save" images={[
      { key: 'save', src: 'icon-save', title: 'action.save' },
      { key: 'print', src: 'icon-header-print', title: 'action.print' },
    ]} />);
    const combobox = screen.getByRole('combobox');
    fireEvent.mouseDown(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Print');
    fireEvent.keyDown(combobox, { key: 'Escape' });
    fireEvent.mouseDown(combobox);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

  it('describes custom icon-only options without adding tooltips to visible text', () => {
    const DropdownWithProviders = withProviders(Dropdown);
    const { rerender } = render(<DropdownWithProviders id="custom-icons" items={['action.save']} renderItem={() => <Icon glyph="icon-save" />} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    fireEvent.focus(screen.getByRole('option'));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
    rerender(<DropdownWithProviders id="custom-icons" items={['action.save']} renderItem={() => <><Icon glyph="icon-save" />Save</>} />);
    fireEvent.focus(screen.getByRole('option'));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

  it('uses the rendered accessible description when a style picker display value is not localized', () => {
    const DropdownWithProviders = withProviders(Dropdown);
    render(<DropdownWithProviders id="border-icons" items={['Thin']} renderItem={() => <div aria-label="Solid"><Icon glyph="icon-save" /></div>} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    fireEvent.focus(screen.getByRole('option', { name: 'Solid' }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Solid');
  });

  it('preserves a custom renderer accessible name independently of its tooltip title', () => {
    const DropdownWithProviders = withProviders(Dropdown);
    render(<DropdownWithProviders id="custom-option-label" items={[{ key: 'custom-save', title: 'action.save' }]} getKey={(item) => item.key} getDisplayValue={(item) => item.key} renderItem={() => <div aria-label="Save the annotated document"><Icon glyph="icon-save" /></div>} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    const option = screen.getByRole('option', { name: 'Save the annotated document' });
    expect(option).not.toHaveAttribute('aria-label');
    fireEvent.pointerMove(option);
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
  });

  it('uses translation prefixes and selects image options with arrows while focus stays on the combobox', () => {
    const onClickItem = jest.fn();
    const DropdownWithProviders = withProviders(Dropdown);
    render(<DropdownWithProviders id="focused-icons" currentSelectionKey="save" translationPrefix="action" images={[
      { key: 'save', src: 'icon-save' },
      { key: 'print', src: 'icon-header-print' },
    ]} onClickItem={onClickItem} />);
    const combobox = screen.getByRole('combobox');
    fireEvent.keyDown(combobox, { key: 'Enter' });
    const option = screen.getByRole('option', { name: 'save' });
    expect(option).not.toHaveAttribute('tabindex');
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
    fireEvent.keyDown(combobox, { key: 'ArrowDown' });
    const nextOption = screen.getByRole('option', { name: 'print' });
    expect(nextOption).not.toHaveAttribute('tabindex');
    expect(combobox).toHaveFocus();
    expect(combobox).toHaveAttribute('aria-activedescendant', 'focused-icons-print');
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Print');
    fireEvent.keyDown(combobox, { key: 'Enter' });
    expect(onClickItem).toHaveBeenCalledWith('print', 1);
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

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