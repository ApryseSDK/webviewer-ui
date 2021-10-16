import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import FilePickerPanel from './FilePickerPanel';

const TestFilePickerPanel = withProviders(FilePickerPanel);
function noop() { };
window.Core = { SupportedFileFormats: { CLIENT: [] }};

describe('FilePickerPanel', () => {
  describe('Component', () => {
    it('Should render component correctly', () => {
      const { container } = render(<TestFilePickerPanel
        defaultValue={''}
        onFileSelect={noop}
      />)
      expect(container.querySelectorAll('.modal-btn-file')).toHaveLength(1);
      expect(true).toBe(true);
    })
  });
});