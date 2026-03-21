import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RedactionSearchMultiSelect from './RedactionSearchMultiSelect';
import RedactionSearchOverlay from './RedactionSearchOverlay';
import { buildSearchOptions } from 'helpers/redactionSearchOptions';

const mockProps = {
  activeTheme: 'light',
  redactionSearchOptions: [
    { label: 'Option 1', value: '1' }
  ]
};

describe('RedactionSearchMultiSelect', () => {
  it('should have an aria-label on the MultiValueRemove component', () => {
    render(<RedactionSearchMultiSelect {...mockProps} />);

    const input = screen.getByRole('combobox');
    userEvent.type(input, 'Test');
    userEvent.type(input, '{enter}');
    // Query for the button and ensure it has the right accessible name, which matches what we typed as a search input
    screen.getByRole('button', { name: 'Remove Test' });
  });
});

describe('RedactionSearchOverlay', () => {
  it('clears terms and executes an empty search when active viewer changes', () => {
    const setSearchTerms = jest.fn();
    const executeRedactionSearch = jest.fn();
    const props = {
      setIsRedactionSearchActive: jest.fn(),
      searchTerms: [{ label: 'secret', value: 'secret', type: 'TEXT' }],
      setSearchTerms,
      executeRedactionSearch,
      activeTheme: 'light',
      activeDocumentViewerKey: 1,
      redactionSearchOptions: [],
    };

    const { rerender } = render(<RedactionSearchOverlay {...props} />);

    rerender(
      <RedactionSearchOverlay
        {...props}
        activeDocumentViewerKey={2}
      />,
    );

    expect(setSearchTerms).toHaveBeenCalledWith([]);
    expect(executeRedactionSearch).toHaveBeenCalledWith(buildSearchOptions([]));
  });
});
