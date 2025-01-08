import React from 'react';
import { render, screen } from '@testing-library/react';
import { Basic } from './ScaleModal.stories';

const noop = () => { };

jest.mock('core', () => ({
  addEventListener: noop,
  removeEventListener: noop,
  getDocumentViewers: () => [{
    getAnnotationManager: () => ({
      getAnnotationsList: () => []
    })
  }],
}));

const TestAnnotationPopup = withProviders(Basic);

describe('Scale Modal Component', () => {
  it('renders correctly and has appropriate accessibility labels', () => {
    render(<TestAnnotationPopup />);

    const unitInputs = screen.getAllByLabelText('Units');
    expect(unitInputs.length).toBe(2);
    unitInputs.forEach((input) => {
      expect(input).toHaveAttribute('aria-label', 'Units');
    });

    // There are three dropdowns that should have the appropriate accessibility labels
    screen.getByRole('combobox', { name: /Precision/i });
    screen.getByRole('combobox', { name: /Paper Units/i });
    screen.getByRole('combobox', { name: /Display Units/i });
  });
});