import Button from './Button';
import React from 'react';
import { TOOLTIP_SHOW_DELAY } from 'constants/tooltip';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { setClickMiddleWare } from 'helpers/clickTracker';
import userEvent from '@testing-library/user-event';
import { BasicButton } from './Button.stories';
import closeTooltip from 'src/apis/closeToolTip';

const ButtonWithProviders = withProviders(Button);
const ButtonStory = BasicButton;

describe('Button component', () => {
  it('Triggers middleware when clicked', () => {
    const container = render(<ButtonWithProviders dataElement="test"/>);
    const middleware = jest.fn();
    setClickMiddleWare(middleware);
    const button = container.getByRole('button');
    fireEvent.click(button);
    expect(middleware).toHaveBeenCalledTimes(1);
    expect(middleware).toHaveBeenCalledWith('test', { type: 'button' });
  });

  it('Check aria current', async () => {
    render(<ButtonStory />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-current', 'false');

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-current', 'true');
  });

  it('Check aria selected', async () => {
    render(<ButtonStory />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-selected', 'false');

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-selected', 'true');
  });

  it('Check aria pressed', async () => {
    render(<ButtonStory />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('Check aria expanded', async () => {
    render(<ButtonStory />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('can render text even when it has a colon', () => {
    render(<ButtonWithProviders label={'The time is 4:20pm'}/>);
    screen.getByText('The time is 4:20pm');
  });
});

describe('Icon-only button tooltips', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it.each([
    { title: 'action.save', name: 'Save' },
    { ariaLabel: 'action.save', name: 'action.save' },
    { title: 'action.save', ariaLabel: 'Save the annotated document', name: 'Save the annotated document' },
  ])('localizes tooltip text while preserving the accessible name from %j', ({ name, ...descriptionProps }) => {
    render(<ButtonWithProviders img="icon-save" {...descriptionProps} />);
    fireEvent.focus(screen.getByRole('button', { name }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
  });

  it('does not add an aria-label fallback tooltip when text is visible', () => {
    render(<ButtonWithProviders img="icon-save" label="action.save" ariaLabel="action.save" />);
    fireEvent.focus(screen.getByRole('button', { name: 'action.save' }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

  it('does not show redundant title tooltips on labeled flyout buttons', () => {
    render(<ButtonWithProviders img="icon-save" label="action.save" title="action.save" isFlyoutItem />);
    fireEvent.focus(screen.getByRole('button', { name: 'Save' }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

  it('shows only the latest hovered button tooltip and preserves explicit dismissal', () => {
    render(<><ButtonWithProviders img="icon-save" title="action.save" /><ButtonWithProviders img="icon-header-print-line" title="action.print" /></>);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    const printButton = screen.getByRole('button', { name: 'Print' });
    fireEvent(saveButton, new MouseEvent('pointermove', { bubbles: true, clientX: 40, clientY: 10 }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    const originalTooltip = document.querySelector('[data-element="tooltip"]');
    expect(originalTooltip).toHaveTextContent('Save');
    jest.spyOn(originalTooltip, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 100, top: 20, bottom: 100, width: 100, height: 80 });
    fireEvent(printButton, new MouseEvent('pointermove', { bubbles: true, clientX: 40, clientY: 50 }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelectorAll('[data-element="tooltip"]')).toHaveLength(1);
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Print');
    fireEvent(saveButton, new MouseEvent('pointermove', { bubbles: true, clientX: 40, clientY: 10 }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelectorAll('[data-element="tooltip"]')).toHaveLength(1);
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
    act(() => closeTooltip());
    fireEvent(saveButton, new MouseEvent('pointermove', { bubbles: true, clientX: 40, clientY: 10 }));
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });
});
