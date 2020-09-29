import React from 'react';
import { render } from '@testing-library/react';
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
    const { container } = render(<ListSeparator renderContent={renderContent} />);
    // make sure list separator component is rendered
    const listSeparator = container.querySelector('.ListSeparator');
    expect(listSeparator).toBeInTheDocument();
    // verify that list separator content is the same as renderContent() returns
    expect(listSeparator.innerHTML).toEqual(testContent);
  });

});
