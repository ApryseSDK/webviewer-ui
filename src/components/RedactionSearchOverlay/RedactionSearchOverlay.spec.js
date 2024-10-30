import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RedactionSearchMultiSelect from './RedactionSearchMultiSelect';

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
