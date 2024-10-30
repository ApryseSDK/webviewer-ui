import TextButton from './TextButton';
import React from 'react';
import { render } from '@testing-library/react';

const TextButtonWithProviders = withProviders(TextButton);


describe('TextButton component', () => {
  it('Should render without errors', () => {
    expect(() => {
      render(<TextButtonWithProviders/>);
    }).not.toThrow();
  });

  it('Should have an Aria Label', () => {
    const container = render(<TextButtonWithProviders dataElement="test" ariaLabel="do something"/>);
    const button = container.getByRole('button');

    expect(button).toHaveAttribute('aria-label');
  });
});