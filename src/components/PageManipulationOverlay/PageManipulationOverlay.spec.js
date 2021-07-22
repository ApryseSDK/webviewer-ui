import React from 'react';
import { render } from '@testing-library/react';
import PageManipulationOverlay from './PageManipulationOverlay';
import { Basic } from './PageManipulationOverlay.stories';

const BasicPageManipulationOverlayStory = withI18n(Basic);
const TestPageManipulationOverlay = withProviders(PageManipulationOverlay);

describe('PageManipulationOverlay', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicPageManipulationOverlayStory />)
      }).not.toThrow();
    })

    it('Renders 7 rows for each of the operations currently supported in the overlay', () => {
      /**
       * - Rotate Clockwise
       * - Rotate CounterClockwise
       * - Insert page above
       * - Insert page below
       * - Replace Page
       * - Extract page
       * - Delete Page
       */
      const supportedOperations = 7;
      const { container } = render(
        <TestPageManipulationOverlay />
      );
      expect(container.querySelectorAll('.row')).toHaveLength(7);
    })
  })
})