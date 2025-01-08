import React from 'react';
import { render } from '@testing-library/react';
import { Basic, NotModifiable } from './ScaleSelector.stories';

describe('ScaleSelector', () => {
  it('renders the Basic storybook component', () => {
    expect(() => {
      render(<Basic />);
    }).not.toThrow();
  });

  it('renders the NotModifiable storybook component', () => {
    expect(() => {
      render(<NotModifiable />);
    }).not.toThrow();
  });
});