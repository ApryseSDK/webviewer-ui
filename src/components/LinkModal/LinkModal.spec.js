import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { NoURLInput } from './LinkModal.stories';
import core from 'core';

core.addEventListener = jest.fn();

describe('LinkModal', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<NoURLInput />);
      }).not.toThrow();
    });
  });
});
