import Thumbnail from './Thumbnail';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import core from 'core';

jest.mock('core');

describe('Thumbnail', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<Thumbnail />);
      }).not.toThrow();
    });

    it('Should render document controls if enabled', () => {
      const { container } = render(<Thumbnail />);
      // Verify that container div is in the document to draw thumb canvas
      expect(container.querySelector('.container')).toBeInTheDocument();
    });

    it('Should render document controls if enabled', () => {
      const { container } = render(<Thumbnail />);
      // Verify that page label div is in the document
      expect(container.querySelector('.page-label')).toBeInTheDocument();
    });

    it('Should render document controls if enabled', () => {
      const { container } = render(<Thumbnail />);
      // Verify that thumbnail div is in the document to draw thumb canvas
      expect(container.querySelector('.thumbnail')).toBeInTheDocument();
    });
  });
});
