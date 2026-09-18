import ImageSignature from './ImageSignature/ImageSignature';
import TextSignature from './TextSignature/TextSignature';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TextSignaturePanel } from './SignatureModal.stories';
import userEvent from '@testing-library/user-event';
import SignatureModal from './SignatureModal';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

const ImageSignatureMock = withProviders(ImageSignature);
const TextSignatureMock = withProviders(TextSignature, {
  viewer: {
    signatureFonts: ['Satisfy'],
    textSignatureCanvasMultiplier: 1,
  },
});

jest.mock('core', () => ({
  getScrollViewElement: () => ({
    getBoundingClientRect: () => ({}),
  }),
  getDocumentViewer: () => ({
    getTool: () => ({
      defaults: {},
      setSignatureCanvas: noop,
      setInitialsCanvas: noop,
      clearSignatureCanvas: noop,
      clearInitialsCanvas: noop,
    }),
  }),
  getDocumentViewers: () => [{
    getTool: () => ({
      defaults: {},
      setSignatureCanvas: noop,
      setInitialsCanvas: noop,
      clearSignatureCanvas: noop,
      clearInitialsCanvas: noop,
    }),
  }],
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

  it('Should include buttons for choosing a signature and initials', () => {
    render(<ImageSignatureMock />);

    const fullSignatureButton = screen.getByRole('button', { name: 'Choose a signature' });
    const initialSignatureButton = screen.getByRole('button', { name: 'Choose Initials' });
    expect(fullSignatureButton).toBeInTheDocument();
    expect(initialSignatureButton).toBeInTheDocument();
  });
});

describe('TextSignaturePanel', () => {
  it('uses the first configured signature modal color by default', () => {
    render(
      <TextSignatureMock
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
        /* eslint-disable-next-line custom/no-hex-colors */
        signatureModalColors={['#008000', '#800080']}
      />
    );

    const firstColor = screen.getByRole('button', { name: /#008000/ });
    const secondColor = screen.getByRole('button', { name: /#800080/ });
    expect(firstColor).toHaveAttribute('aria-current', 'true');
    expect(secondColor).toHaveAttribute('aria-current', 'false');
    expect(screen.queryByRole('button', { name: /#4E7DE9/ })).not.toBeInTheDocument();
  });

  it('uses the shared selected signature color', () => {
    /* eslint-disable custom/no-hex-colors */
    const selectedSignatureColor = new window.Core.Annotations.Color('#800080');

    render(
      <TextSignatureMock
        isModalOpen={false}
        isTabPanelSelected={false}
        disableCreateButton={noop}
        enableCreateButton={noop}
        signatureModalColors={['#008000', '#800080']}
        selectedSignatureColor={selectedSignatureColor}
      />
    );

    expect(screen.getByRole('button', { name: /#008000/ })).toHaveAttribute('aria-current', 'false');
    expect(screen.getByRole('button', { name: /#800080/ })).toHaveAttribute('aria-current', 'true');
    /* eslint-enable custom/no-hex-colors */
  });

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

describe('SignatureModal disclaimer', () => {
  const baseViewerState = {
    disabledElements: {},
    customElementOverrides: {},
    savedSignatures: [],
    displayedSignaturesFilterFunction: () => true,
    tab: {
      signatureModal: 'textSignaturePanelButton',
    },
    activeToolName: 'AnnotationCreateSignature',
    signatureFonts: ['Satisfy', 'Nothing-You-Could-Do', 'La-Belle-Aurore', 'Whisper'],
    toolbarGroup: 'toolbarGroup-Insert',
    customPanels: [],
    genericPanels: [],
    openElements: {
      signatureModal: true,
    },
  };

  it('shows the disclaimer text when enabled', () => {
    const SignatureModalMock = withProviders(SignatureModal, {
      viewer: { ...baseViewerState, signatureDisclaimerEnabled: true },
    });
    render(<SignatureModalMock />);
    expect(screen.getByText(getTranslatedText('message.signatureDisclaimer'))).toBeInTheDocument();
  });

  it('hides the disclaimer text when disabled', () => {
    const SignatureModalMock = withProviders(SignatureModal, {
      viewer: { ...baseViewerState, signatureDisclaimerEnabled: false },
    });
    render(<SignatureModalMock />);
    expect(screen.queryByText(getTranslatedText('message.signatureDisclaimer'))).not.toBeInTheDocument();
  });
});
