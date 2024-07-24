import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignatureListPanel from './SignatureListPanel';

const SignatureListPanelWithRedux = withProviders(SignatureListPanel);

describe.only('SignatureListPanel component', () => {
  it('renders the component correctly', () => {
    render(<SignatureListPanelWithRedux />);
    screen.getByText(/New Signature/);
  });

  // this test is skipped as there is an issue with JSDOM to be investigated
  // https://github.com/jsdom/jsdom/issues/3359
  it.skip('applies focus-visible styles when focused via keyboard', () => {
    render(<SignatureListPanelWithRedux />);

    const button = screen.getByRole('button', { name: /New Signature/ });

    // Simulate keyboard navigation to focus the button
    // button.focus();
    userEvent.tab();

    // Log the computed styles
    const styles = window.getComputedStyle(button);
    console.log('Computed styles:', styles);

    // Check if the focus-visible styles are applied
    expect(button).toHaveFocus();
    expect(button).toHaveStyle({
      borderWidth: '2px'
    });

    // Simulate mouse click to ensure focus-visible styles are not applied
    userEvent.tab();

    // Check if focus-visible styles are not applied
    expect(button).not.toHaveStyle({
      borderWidth: '2px'
    });
  });
});