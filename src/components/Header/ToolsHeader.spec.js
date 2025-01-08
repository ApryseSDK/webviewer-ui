import React from 'react';
import { render } from '@testing-library/react';
import { ToolsHeaderToolActive } from './ToolsHeader.stories';

const ToolsHeaderToolActiveComp = withProviders(ToolsHeaderToolActive);


const NOOP = () => { };

jest.mock('core', () => ({
  getDocumentViewer: () => {
    return {
      getTool: NOOP
    };
  },
  getTool: () => {
    return {
      name: 'Fooo',
      defaults: {
        StrokeColor: 'red',
      }
    };
  },
}));

describe('ToolsHeaderToolActive', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<ToolsHeaderToolActiveComp />);
    }).not.toThrow();
  });
});