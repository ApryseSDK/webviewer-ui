import React from 'react';
import { render } from '@testing-library/react';
import { Basic as BasicStory, Placeholder as PlaceholderStory } from './Selector.stories';

const BasicSelectStory = withI18n(BasicStory);

describe('Selector', () => {
  it('Basic story should not throw any errors', () => {
    expect(() => {
      render(<BasicSelectStory />);
    }).not.toThrow();
  });
});

const PlaceHolderSelectStory = withI18n(PlaceholderStory);

describe('Placeholder version', () => {
  it('Should have placeholder text as default item', () => {
    const { container } = render(<PlaceHolderSelectStory />);

    const selectedItem = container.querySelector('.customSelector__selectedItem');
    expect(selectedItem).toHaveTextContent('PLACEHOLDER');
  });
});