import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PageManipulationOverlay from './PageManipulationOverlay';
import { Basic } from './PageManipulationOverlay.stories';

const BasicPageManipulationOverlayStory = withI18n(Basic);
const TestPageManipulationOverlay = withProviders(PageManipulationOverlay);

const basicProps = {
  pageNumbers: [],
  pageManipulationOverlayItems: [
    { dataElement: 'pageAdditionalControls' },
    { type: 'divider' },
    { dataElement: 'pageRotationControls' },
    { type: 'divider' },
    { dataElement: 'pageInsertionControls' },
    { type: 'divider' },
    { dataElement: 'pageManipulationControls' },
  ]
};

describe('PageManipulationOverlay', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicPageManipulationOverlayStory {...basicProps} />);
      }).not.toThrow();
    });

    it('Renders as a default 9 rows for each of the operations currently supported in the overlay', () => {
      /**
       * - Rotate Clockwise
       * - Rotate CounterClockwise
       * - Insert page above
       * - Insert page below
       * - Replace Page// NOT SUPPORTED RIGHT NOW
       * - Extract page
       * - Delete Page
       * - Move Page to top
       * - Move Page to bottom
       */
      const supportedOperations = 8;
      const { container } = render(
        <TestPageManipulationOverlay {...basicProps} />
      );
      expect(container.querySelectorAll('.row')).toHaveLength(supportedOperations);
    });

    it('I can remove page operation sections by modifying the pageManipulationOverlayItems props', () => {
      //Remove the rotation controls
      const testProps = {
        pageNumbers: [],
        pageManipulationOverlayItems: [
          { dataElement: 'pageInsertionControls' },
          { type: 'divider' },
          { dataElement: 'pageManipulationControls' },
        ]
      };
      const { container } = render(
        <TestPageManipulationOverlay {...testProps} />
      );
      expect(container.querySelectorAll('.row')).toHaveLength(4);
    });

    it('I can customize the page manipulation overlay with custom operations', () => {
      //Add my custom section with two operations
      const customOperationProps = {
        pageNumbers: [],
        pageManipulationOverlayItems: [
          {
            type: 'customPageOperation',
            header: 'Custom options',
            dataElement: 'customPageOperations',
            operations: [
              {
                title: 'Alert me',
                img: '/path-to-image',
                onClick: pageNumbers => {
                  alert(`Selected thumbnail pages: ${pageNumbers}`);
                },
                dataElement: 'customPageOperationButton',
              },
              {
                title: 'Alert me again',
                img: '/path-to-image',
                onClick: pageNumbers => {
                  alert(`Selected thumbnail pages: ${pageNumbers}`);
                },
                dataElement: 'customPageOperationButtonTwo',
              }
            ]
          },
          { type: 'divider' }
        ]
      };
      const { container } = render(
        <TestPageManipulationOverlay {...customOperationProps} />
      );
      expect(container.querySelectorAll('.row')).toHaveLength(2);
      expect(container.querySelectorAll('div[data-element="customPageOperationButton"]')).toHaveLength(1);
      expect(container.querySelectorAll('div[data-element="customPageOperationButtonTwo"]')).toHaveLength(1);
    });

    it('When I add a custom page operation, my handler gets called with an array of thumbnail pages that are selected', () => {
      //Add my custom section with one operation
      const myOnClickHandler = jest.fn();
      const pages = [1, 2];
      const customOperationProps = {
        pageNumbers: pages,
        pageManipulationOverlayItems: [
          {
            type: 'customPageOperation',
            header: 'Custom options',
            dataElement: 'customPageOperations',
            operations: [
              {
                title: 'Alert me',
                img: '/path-to-image',
                onClick: myOnClickHandler,
                dataElement: 'customPageOperationButton',
              }
            ]
          },
          { type: 'divider' }
        ]
      };
      const { container } = render(
        <TestPageManipulationOverlay {...customOperationProps} />
      );

      //Click the button
      const customOperationButton = container.querySelectorAll('div[data-element="customPageOperationButton"]')[0];
      fireEvent.click(customOperationButton);
      expect(myOnClickHandler).toBeCalledWith(pages);
    });
  });
});
