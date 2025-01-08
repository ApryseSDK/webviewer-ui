import React from 'react';
import { render, screen } from '@testing-library/react';
import ListSeparator from './ListSeparator';
import { Basic as ListSeparatorStory } from './ListSeparator.stories';

describe('ListSeparator component', () => {
  it('Should render without any props', () => {
    expect(() => {
      render(<ListSeparator />);
    }).not.toThrow();
  });

  it('Should render story without errors', () => {
    expect(() => {
      render(<ListSeparatorStory />);
    }).not.toThrow();
  });

  it('Should render component with render function ', () => {
    const testContent = 'my test content';
    function renderContent() {
      return testContent;
    }
    render(<ListSeparator renderContent={renderContent} />);
    // make sure list separator component is rendered
    const listSeparator = screen.getByRole('heading', { level: 4 });
    expect(listSeparator).toBeInTheDocument();
    // verify that list separator content is the same as renderContent() returns
    expect(listSeparator.innerHTML).toEqual(testContent);
  });
});
