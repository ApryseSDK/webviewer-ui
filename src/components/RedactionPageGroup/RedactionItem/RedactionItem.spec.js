import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RedactionItem from './RedactionItem';
import { setMockRefElement } from '../../NoteTextPreview/NoteTextPreview.spec';

import {
  TextRedactionItem,
  RegionRedactionItem,
  FullPageRedactionItem
} from './RedactionItem.stories';

const getMockRedactionAnnotation = () => (
  {
    Author: 'Duncan Idaho',
    DateCreated: '2021-08-19T22:43:04.795Z',
    getReplies: () => [1, 2, 3],
    getStatus: () => '',
    isReply: () => false,
  }
);

function noop() { };

const RedactionItemWithRedux = withProviders(RedactionItem);


describe('RedactionItem', () => {
  describe('storybook components', () => {
    it('renders text redaction item correctly', () => {
      expect(() => {
        render(<TextRedactionItem />)
      }).not.toThrow();
    });

    it('renders region redaction item correctly', () => {
      expect(() => {
        render(<RegionRedactionItem />)
      }).not.toThrow();
    });

    it('renders full page redaction item correctly', () => {
      expect(() => {
        render(<FullPageRedactionItem />)
      }).not.toThrow();
    });
  });

  describe('component', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('when it is a text redaction, it renders a text preview', async () => {
      // Handy helper to mock the ref that is used by the text preview component
      setMockRefElement({ clientWidth: 150 })
      const mockRedactionAnnotation = getMockRedactionAnnotation();
      mockRedactionAnnotation.IsText = true;
      const textRedactionItemProps = {
        iconColor: '#E44234',
        annotation: mockRedactionAnnotation,
        author: mockRedactionAnnotation.Author,
        dateFormat: 'MMM D, LT',
        language: 'en',
        textPreview: 'This is a preview of the text that will be redacted by Duncan Idaho'
      };

      render(<RedactionItemWithRedux {...textRedactionItemProps} />);
      screen.getByText('This is a preview of the text that will be redacted by Duncan Idaho')
    });

    it('when it is a region redaction, it renders the correct message', () => {
      const mockRedactionAnnotation = getMockRedactionAnnotation();
      const regionRedactionItemProps = {
        iconColor: '#E44234',
        annotation: mockRedactionAnnotation,
        author: mockRedactionAnnotation.Author,
        dateFormat: 'MMM D, LT',
        language: 'en',
      };

      render(<RedactionItemWithRedux {...regionRedactionItemProps} />);
      screen.getByText('Region redaction')
    });

    it.skip('when it is a full page redaction, it renders the correct message', () => {
      // TODO: Waiting on full page redaction stuff to get merged so I can add a flag
      // or a way to mark these annotation
    });

    it.skip('renders an icon with the correct color', () => {
      // This would be nice with a snapshot
    });

    it('when the item is selected, it has the styling for selected items', () => {
      const mockRedactionAnnotation = getMockRedactionAnnotation();
      const regionRedactionItemProps = {
        iconColor: '#E44234',
        annotation: mockRedactionAnnotation,
        author: mockRedactionAnnotation.Author,
        dateFormat: 'MMM D, LT',
        language: 'en',
        onRedactionItemDelete: noop,
        onRedactionItemSelection: noop,
        isSelected: true,
      };

      render(<RedactionItemWithRedux {...regionRedactionItemProps} />);
      const redactionItem = screen.getByRole('listitem');
      expect(redactionItem).toHaveClass('redaction-item selected');
    });

    it('when the redaction item is clicked, it calls the correct handler', () => {
      const mockRedactionAnnotation = getMockRedactionAnnotation();
      const mockOnRedactionItemSelection = jest.fn();
      const regionRedactionItemProps = {
        iconColor: '#E44234',
        annotation: mockRedactionAnnotation,
        author: mockRedactionAnnotation.Author,
        dateFormat: 'MMM D, LT',
        language: 'en',
        onRedactionItemDelete: noop,
        onRedactionItemSelection: mockOnRedactionItemSelection,
      };

      render(<RedactionItemWithRedux {...regionRedactionItemProps} />);
      const redactionItem = screen.getByText('Region redaction');
      userEvent.click(redactionItem);
      expect(mockOnRedactionItemSelection).toHaveBeenCalled();
    });

    it('when the delete button is clicked, it calls the correct handler', () => {
      const mockRedactionAnnotation = getMockRedactionAnnotation();
      const mockOnRedactionItemDelete = jest.fn();
      const regionRedactionItemProps = {
        iconColor: '#E44234',
        annotation: mockRedactionAnnotation,
        author: mockRedactionAnnotation.Author,
        dateFormat: 'MMM D, LT',
        language: 'en',
        onRedactionItemDelete: mockOnRedactionItemDelete,
        onRedactionItemSelection: noop,
      };

      render(<RedactionItemWithRedux {...regionRedactionItemProps} />);
      const deleteButton = screen.getByRole('button');
      userEvent.click(deleteButton);
      expect(mockOnRedactionItemDelete).toHaveBeenCalled();
    });
  })
})