import React from 'react';
import { render, screen } from '@testing-library/react';
import FileInputPanel from './FileInputPanel';

const TestFileInputPanel = withProviders(FileInputPanel);
function noop() { };

describe('FileInputPanel', () => {
  describe('Component', () => {
    it('Should render component correctly', () => {
      render(<TestFileInputPanel
        defaultValue={''}
        onFileSelect={noop}
      />)

      screen.getByRole('textbox');
    })
  });
});