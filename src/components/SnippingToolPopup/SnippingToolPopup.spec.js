import React from 'react';
import { render } from '@testing-library/react';

// Uncomment the following lines after fixing the import issue in `createFeatureAPI.js`
// import { Basic } from './SnippingToolPopup.stories';
// const BasicSnippingToolPopupStory = withI18n(Basic);

const BasicSnippingToolPopupStory = {};

jest.mock('core');

// Skipped due to failing import in `createFeatureAPI.js`
// To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
describe.skip('SnippingToolPopup', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicSnippingToolPopupStory />);
      }).not.toThrow();
    });
  });
});
