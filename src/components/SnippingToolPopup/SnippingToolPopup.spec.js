import React from 'react';
import { render } from '@testing-library/react';
import { Basic } from './SnippingToolPopup.stories';

const BasicSnippingToolPopupStory = withI18n(Basic);

jest.mock('core');

describe('SnippingToolPopup', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicSnippingToolPopupStory />);
      }).not.toThrow();
    });
  });
});
