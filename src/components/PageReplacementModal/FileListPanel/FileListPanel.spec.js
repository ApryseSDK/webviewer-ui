import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileListPanel from './FileListPanel';

const TestFileListPanel = withProviders(FileListPanel);
function noop() { };

describe('FileListPanel', () => {
  describe('Component', () => {
    it('Should render component correctly', () => {
      render(<TestFileListPanel
        defaultValue={''}
        onFileSelect={noop}
        list={[
          { id: '23', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
          { id: '24', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
        ]}
      />)
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('When I select a file from the list, it fires the handler with the right fileID', () => {
      const mockOnFileSelect = jest.fn();
      const fileList = [
        { id: '23', filename: 'Dune.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
        { id: '24', filename: 'Cheetahs.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
      ];

      render(<TestFileListPanel
        defaultValue={''}
        onFileSelect={mockOnFileSelect}
        list={fileList}
      />)

      const fileItem = screen.getByText('Dune.pdf');
      userEvent.click(fileItem);
      expect(mockOnFileSelect).toBeCalledWith(fileList[0]);
    });
  });
});