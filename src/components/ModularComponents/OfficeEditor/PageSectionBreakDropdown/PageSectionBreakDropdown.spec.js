import React from 'react';
import { render } from '@testing-library/react';
import { Basic } from './PageSectionBreakDropdown.stories';

const BasicDropdown = withProviders(Basic);

describe('PageSectionBreakDropdown', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicDropdown />);
    }).not.toThrow();
  });
});
