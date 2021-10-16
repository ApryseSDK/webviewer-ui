import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import FileListPanel from './FileListPanel';

const TestFileListPanel = withProviders(FileListPanel);
function noop() { };

describe('FileListPanel', () => {
  describe('Component', () => {
    it('Should render component correctly', () => {
      const { container } = render(<TestFileListPanel
        defaultValue={''}
        onFileSelect={noop}
        list={[
          { id: '23', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
          { id: '24', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
        ]}
      />)
      expect(container.querySelectorAll('.FileListPanel li')).toHaveLength(2);
    })
  });
});