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

  it('Check aria-extended tag', () => {
    const { container } = render(<ToolsHeaderToolActiveComp />);
    const btn = container.querySelector('[data-element="shapeToolGroupButton"]');
    expect(btn.firstChild.getAttribute('aria-expanded')).toBe('false');

    const btn2 = container.querySelector('[data-element="freeHandToolGroupButton"]');
    expect(btn2.firstChild.getAttribute('aria-expanded')).toBe('true');
  });
});