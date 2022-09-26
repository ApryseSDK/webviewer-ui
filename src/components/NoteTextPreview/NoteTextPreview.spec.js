import React from 'react';
import { render, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteTextPreview from './NoteTextPreview';
import { Basic } from './NoteTextPreview.stories';

const BasicNoteTextPreview = withI18n(Basic);
const TestNoteTextPreview = withProviders(NoteTextPreview);
const sampleText = 'Space: the final frontier. These are the voyages of the starship Enterprise. Its continuing mission: to explore strange new worlds. To seek out new life and new civilizations. To boldly go where no one has gone before!';
// Mock the ref element so we render some text
export const setMockRefElement = (node) => {
  const mockRef = {
    get current() {
      // jest dom elements have no width,
      // so mocking a browser situation
      return node;
    },
    // we need a setter here because it gets called when you
    // pass a ref to <component ref={ref} />
    set current(_value) { },
  };

  jest.spyOn(React, 'useRef').mockReturnValue(mockRef);
};

describe('NoteTextPreview', () => {
  describe('Component', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const panelWidth = 300;
    const clientWidth = 150;


    it('Should not throw any errors when rendering storybook component', () => {
      expect(() => {
        render(<BasicNoteTextPreview />);
      }).not.toThrow();
    });

    it('Renders a "...more" prompt and truncates text', () => {
      setMockRefElement({ clientWidth });
      const { container } = render(
        <TestNoteTextPreview linesToBreak={1} panelWidth={panelWidth}>
          {sampleText}
        </TestNoteTextPreview>
      );
      getByText(container, '...more');
    });

    it('When user clicks "...more" it shows the full text', () => {
      setMockRefElement({ clientWidth });
      const { container } = render(
        <TestNoteTextPreview linesToBreak={1} panelWidth={panelWidth}>
          {sampleText}
        </TestNoteTextPreview>
      );

      userEvent.click(getByText(container, '...more'));
      // The prompt should now be "show less"
      getByText(container, 'show less');
      // And all our text should be rendered
      getByText(container, sampleText);
    });
  });
});