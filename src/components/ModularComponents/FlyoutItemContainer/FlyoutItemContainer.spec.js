import React from 'react';
import { TOOLTIP_SHOW_DELAY } from 'constants/tooltip';
import { act, fireEvent, render, screen } from '@testing-library/react';
import FlyoutItemContainer from './FlyoutItemContainer';
import Icon from 'components/Icon';

const FlyoutItemWithProviders = withProviders(FlyoutItemContainer);

describe('Flyout item tooltips', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it.each([
    { label: '', title: 'action.save' },
    { ariaLabel: 'action.save' },
  ])('describes an icon-only item on focus using %j', (descriptionProps) => {
    const onClick = jest.fn();
    const { unmount } = render(
      <ul><FlyoutItemWithProviders {...descriptionProps} icon={<Icon glyph="icon-save" />} onClickHandler={() => onClick} /></ul>
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).not.toHaveTextContent('Save');
    fireEvent.focus(button);
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
    fireEvent.blur(button);
    fireEvent.focus(button);
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toBeInTheDocument();
    unmount();
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

  it.each([{ label: 'action.save' }, { title: 'action.save' }])('does not add a tooltip to a visible label from %j', (descriptionProps) => {
    render(<ul><FlyoutItemWithProviders {...descriptionProps} icon={<Icon glyph="icon-save" />} /></ul>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveTextContent('Save');
    fireEvent.focus(button);
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).not.toBeInTheDocument();
  });

  it('preserves an explicit accessible label when an icon-only item also has a tooltip title', () => {
    render(<ul><FlyoutItemWithProviders label="" title="action.save" ariaLabel="Save the annotated document" icon={<Icon glyph="icon-save" />} /></ul>);
    const button = screen.getByRole('button', { name: 'Save the annotated document' });
    fireEvent.focus(button);
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(button).toHaveAttribute('aria-label', 'Save the annotated document');
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
  });

  it('describes disabled icon-only items on hover without enabling their action', () => {
    const onClick = jest.fn();
    render(<ul><FlyoutItemWithProviders ariaLabel="action.save" disabled icon={<Icon glyph="icon-save" />} onClickHandler={() => onClick} /></ul>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    fireEvent.pointerMove(button);
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('describes icon-only submenu triggers on focus', () => {
    render(<ul><FlyoutItemWithProviders ariaLabel="action.save" icon={<Icon glyph="icon-save" />}>{[{ label: 'Child' }]}</FlyoutItemWithProviders></ul>);
    const button = screen.getByRole('button', { name: 'Save' });
    fireEvent.focus(button);
    act(() => jest.advanceTimersByTime(TOOLTIP_SHOW_DELAY));
    expect(document.querySelector('[data-element="tooltip"]')).toHaveTextContent('Save');
  });
});