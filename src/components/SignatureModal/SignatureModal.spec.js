import ImageSignature from './ImageSignature/ImageSignature';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextSignaturePanel } from './SignatureModal.stories';
import userEvent from '@testing-library/user-event';

const ImageSignatureMock = withProviders(ImageSignature);

jest.mock('core', () => ({
  getScrollViewElement: () => ({
    getBoundingClientRect: () => ({}),
  }),
  getDocumentViewer: () => ({
    getTool: noop,
  }),
  getToolsFromAllDocumentViewers: () => [
    {
      ACCEPTED_FILE_SIZE: 10485760,
      setInitials: noop,
      setSignature: noop,
    }
  ],
  getTool: () => ({
    defaults: {},
    setSignatureCanvas: noop,
    setInitialsCanvas: noop,
    clearSignatureCanvas: noop,
    clearInitialsCanvas: noop,
  }),
  getCurrentUser: () => 'Duncan Idaho',
  getDisplayAuthor: () => 'Duncan Idaho',
  addEventListener: noop,
  removeEventListener: noop
}));

jest.mock('helpers/cropImageFromCanvas');

const noop = () => { };

describe('ImageSignature', () => {
  it('Component should not throw any errors', () => {
    expect(() => {
      render(<ImageSignatureMock />);
    }).not.toThrow();
  });

  it('Should render document controls if enabled and role', () => {
    render(<ImageSignatureMock />);

    const fullSignatureButton = screen.getByRole('button', { description: 'Choose a Signature' });
    const initialSignatureButton = screen.getByRole('button', { description: 'Choose Initials' });
    expect(fullSignatureButton).toBeInTheDocument();
    expect(initialSignatureButton).toBeInTheDocument();
  });
});

describe('TextSignaturePanel', () => {
  it('renders the text signature panel story with no errors', () => {
    expect(() => {
      render(<TextSignaturePanel />);
    }).not.toThrow();
  });

  it('has a textbox with the correct a11y label', () => {
    render(<TextSignaturePanel />);
    screen.getByRole('textbox', { name: /Type Signature/ });
  });

  it('renders the font dropdown with the correct labels', () => {
    render(<TextSignaturePanel />);
    const fontDropdown = screen.getByRole('combobox', { name: 'Font Family' });
    userEvent.click(fontDropdown);
    // The signed name is Duncan Idaho but each option should read the font name, not the signed name
    screen.getByRole('option', { name: 'Satisfy' });
    screen.getByRole('option', { name: 'Nothing-You-Could-Do' });
    screen.getByRole('option', { name: 'La-Belle-Aurore' });
    screen.getByRole('option', { name: 'Whisper' });

    // But we render the signed name in the option
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    options.forEach((option) => {
      expect(option).toHaveTextContent('Duncan Idaho');
    });
  });
});