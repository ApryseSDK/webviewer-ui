import React from 'react';
import { render, screen } from '@testing-library/react';
import { DefaultHeader } from './Header.stories';

const DefaultHeaderComp = withProviders(DefaultHeader);

jest.mock('core');

describe('DefaultHeader Test', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<DefaultHeaderComp />);
    }).not.toThrow();
  });

  it('Check aria-current tag', () => {
    render(<DefaultHeader />);

    const panToolButton = screen.getByLabelText('Pan');
    expect(panToolButton.getAttribute('aria-current')).toBe('false');

    const selectToolButton = screen.getByLabelText('Select');
    expect(selectToolButton.getAttribute('aria-current')).toBe('true');
  });
});