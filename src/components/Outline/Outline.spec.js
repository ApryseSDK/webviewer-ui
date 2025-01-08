import React from 'react';
import { render } from '@testing-library/react';
import { Basic } from './Outline.stories';

const BasicOutline = withProviders(Basic);

describe('Outline', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutline />);
    }).not.toThrow();
  });
});
