import React from 'react';
import { render, fireEvent, getByText } from '@testing-library/react';
import FileInputPanel from './FileInputPanel';

const TestFileInputPanel = withProviders(FileInputPanel);
function noop() { };

describe('FileInputPanel', () => {
  describe('Component', () => {
    it('Should render component correctly', () => {
      const { container } = render(<TestFileInputPanel
        defaultValue={''}
        onFileSelect={noop}
      />)
      expect(container.querySelectorAll('.url-input')).toHaveLength(1);
    })
  });
});