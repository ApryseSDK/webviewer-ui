import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SaveModal from './SaveModal';

const TestSaveModal = withProviders(SaveModal);

jest.mock('core');

describe('SaveModal', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<TestSaveModal />);
      }).not.toThrow();
    });

    it('Test SaveModals empty File Name input', async () => {
      const { container } = render(
        <TestSaveModal />,
      );

      expect(container.querySelector('.ui__input__messageText')).toBeInTheDocument();
      const input = screen.getByTestId('fileNameInput');
      fireEvent.change(input, {
        target: {
          value: 'matti'
        }
      });
      expect(container.querySelector('.ui__input__messageText')).not.toBeInTheDocument();
    });
  });
});
