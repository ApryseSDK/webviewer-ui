import React from 'react';
import { render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import InsertBlankPagePanel from './InsertBlankPagePanel';
import { InsertBlankPagePanel, InsertUploadedPagePanel } from '../InsertPageModal.stories';

describe('InsertBlankPagePanel', () => {
  describe('Storybook component', () => {
    it('Renders InsertBlankPagePanel StoryBook component with file selected with no errors', async () => {
      expect(() => {
        render(<InsertBlankPagePanel />);
      }).not.toThrow();
    });

    it('Renders InsertUploadedPagePanel StoryBook component with file selected with no errors', async () => {
      expect(() => {
        render(<InsertUploadedPagePanel />);
      }).not.toThrow();
    });
  });
});
