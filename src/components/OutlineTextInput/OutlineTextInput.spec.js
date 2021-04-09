import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Basic } from './OutlineTextInput.stories';

describe.only('OutlineTextInput', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<Basic />);
    }).not.toThrow();
  });

  it('Should focus on mount', () => {
    const { container } = render(<Basic />);
    const activeElement = document.activeElement;

    expect(activeElement === container.querySelector('.OutlineTextInput')).toBe(true);
  });

  it('Should work with onEnter and onEscape props', () => {
    const onEnter = jest.fn();
    const onEscape = jest.fn();
    const { container } = render(<Basic onEnter={onEnter} onEscape={onEscape} />);
    const input = container.querySelector('input');

    fireEvent.change(input, { target: { value: '23' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onEnter).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });
});
