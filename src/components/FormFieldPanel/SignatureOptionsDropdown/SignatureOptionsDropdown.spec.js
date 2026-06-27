import React from 'react';
import { render, screen } from '@testing-library/react';
import SignatureOptionsDropdown from './SignatureOptionsDropdown';
import { SignatureOptions } from './SignatureOptionsDropdown.stories';

const SignatureOptionsStory = withI18n(SignatureOptions);
const TestSignatureOptions = withProviders(SignatureOptionsDropdown);

function noop() { }

describe('FormFieldEditPopup', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<SignatureOptionsStory />);
      }).not.toThrow();
    });

    it('Should have the correct dropdown label', () => {
      render(
        <TestSignatureOptions
          onChangeHandler={noop}
          initialOptions={'Signature'}
        />,
      );

      const inputElement = screen.getByRole('combobox');
      expect(inputElement).toHaveAccessibleName('Field Type:');
    });
  });
});