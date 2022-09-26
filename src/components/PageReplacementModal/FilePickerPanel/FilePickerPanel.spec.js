import React from 'react';
import { render, screen } from '@testing-library/react';
import FilePickerPanel from './FilePickerPanel';

const TestFilePickerPanel = withProviders(FilePickerPanel);
function noop() { }

describe('FilePickerPanel', () => {
  describe('Component', () => {
    it('Should render component correctly with an input for a file', () => {
      render(<TestFilePickerPanel
        defaultValue={''}
        onFileSelect={noop}
      />);
      screen.getByText('Choose a file');
    });
  });
});