import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultWarningModal } from './WarningModal.stories';

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

const TestAnnotationPopup = withProviders(DefaultWarningModal);

describe('Warning Modal Component', () => {

  it('Should have the focus trapped in the Warning Modal component', () => {
    render(<TestAnnotationPopup />);

    const buttons = screen.getAllByRole('button');

    // Initial focus on the first button
    buttons[0].focus();
    expect(buttons[0]).toHaveFocus();

    // Loop through the buttons to simulate tabbing
    for (let i = 1; i < buttons.length; i++) {
      userEvent.tab();
      expect(buttons[i]).toHaveFocus();
    }

    // Press Tab again to move focus back to the first button
    userEvent.tab();
    expect(buttons[0]).toHaveFocus();

    // Press Shift+Tab to move focus back to the last button
    userEvent.tab({ shift: true });
    expect(buttons[buttons.length - 1]).toHaveFocus();
  });

  it('Should not have aria-hidden={true} in any element except exit icon', () => {
    const { container } = render(<TestAnnotationPopup />);

    // Query all elements that may have aria-hidden attribute using container
    const elementsWithAriaHidden = container.querySelectorAll('[aria-hidden="true"]');

    // Check that no element has aria-hidden="true" (except exit icon since icons are aria-hidden by default)
    expect(elementsWithAriaHidden.length).toBe(1);
  });
});