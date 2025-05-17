import React from 'react';
import { render } from '@testing-library/react';

// Uncomment the following lines after fixing the import issue in `createFeatureAPI.js`
// import { Basic } from './OfficeEditorMarginDropdown.stories';
// const BasicDropdown = withProviders(Basic);

const BasicDropdown = {};

// Skipped due to failing import in `createFeatureAPI.js`
// To be fixed as part of https://apryse.atlassian.net/browse/WVR-8684
describe.skip('MarginDropdown', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicDropdown />);
    }).not.toThrow();
  });
});
