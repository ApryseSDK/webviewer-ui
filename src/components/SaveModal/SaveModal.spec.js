import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SaveModal from './SaveModal';
import core from 'core';
import { workerTypes } from 'constants/types';
import useFocusOnClose from 'hooks/useFocusOnClose';
import downloadPdf from 'helpers/downloadPdf';
import userEvent from '@testing-library/user-event';

const TestSaveModal = withProviders(SaveModal);

jest.mock('core');
jest.mock('hooks/useFocusOnClose');
jest.mock('helpers/downloadPdf', () => jest.fn());
jest.mock('helpers/officeEditor', () => ({
  isOfficeEditorMode: jest.fn(() => false),
}));

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

    it('invokes save when pressing enter in filename input', () => {
      jest.clearAllMocks();
      const focusHandler = jest.fn();
      useFocusOnClose.mockReturnValue(focusHandler);
      const documentMock = {
        getFilename: () => 'sample.pdf',
        getType: () => workerTypes.PDF,
        getDocumentCompletePromise: jest.fn().mockResolvedValue(undefined),
      };
      core.getDocument.mockReturnValue(documentMock);

      render(<TestSaveModal />);

      const input = screen.getByRole('textbox', { name: /file name/i });
      userEvent.clear(input);
      userEvent.type(input, 'my-file{enter}');

      expect(focusHandler).toHaveBeenCalledTimes(1);
      expect(downloadPdf).toHaveBeenCalledTimes(1);
    });
  });
});