import React from 'react';
import { render, screen } from '@testing-library/react';
import FileInputPanel from './FileInputPanel';

const TestFileInputPanel = withProviders(FileInputPanel);
function noop() { }

describe('FileInputPanel', () => {
  describe('Component', () => {
    it('Should render component correctly', () => {
      render(<TestFileInputPanel
        defaultValue={''}
        onFileSelect={noop}
      />);

      screen.getByRole('textbox');
    });
    it('Should render component correctly and show accessible dropdown with label', () => {
      render(<TestFileInputPanel
        defaultValue={''}
        onFileSelect={noop}
        setExtension={noop}
      />);

      // Having the name set means it is accessible to screen readers
      screen.getByRole('combobox', { name: 'File Extension' });
    });
  });
});