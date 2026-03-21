import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RedactionSearchOverlayContainer from './RedactionSearchOverlayContainer';
import { RedactionPanelContext } from '../RedactionPanel/RedactionPanelContext';

const mockMultiSearch = jest.fn();
jest.mock('../../helpers/multiSearch', () => jest.fn(() => mockMultiSearch));

const renderWithProviders = (mockInitialState = {}, props = {}) => {
  const Wrapped = withProviders(RedactionSearchOverlayContainer, mockInitialState);
  const contextValue = {
    setIsRedactionSearchActive: jest.fn(),
  };
  return render(
    <RedactionPanelContext.Provider value={contextValue}>
      <Wrapped {...props} />
    </RedactionPanelContext.Provider>,
  );
};

describe('RedactionSearchOverlayContainer', () => {
  beforeEach(() => {
    mockMultiSearch.mockClear();
  });

  it('escapes plain text input and forces case insensitive', async () => {
    renderWithProviders(
      {
        viewer: { activeTheme: 'light' },
        search: {
          redactionSearchPatterns: {},
        },
      },
      {
        searchTerms: [],
        setSearchTerms: jest.fn(),
      },
    );

    const input = screen.getByRole('combobox');
    userEvent.type(input, '$50{enter}');

    await waitFor(() => {
      expect(mockMultiSearch).toHaveBeenCalled();
    });

    const lastCallArgs = mockMultiSearch.mock.calls[mockMultiSearch.mock.calls.length - 1][0];
    expect(lastCallArgs.textSearch).toEqual(['\\$50']);
    expect(lastCallArgs.caseSensitive).toBe(false);
  });

  it('treats regex literal input as regex and respects /i flag', async () => {
    renderWithProviders(
      {
        viewer: { activeTheme: 'light' },
        search: {
          redactionSearchPatterns: {},
        },
      },
      {
        searchTerms: [],
        setSearchTerms: jest.fn(),
      },
    );

    const input = screen.getByRole('combobox');
    userEvent.type(input, '/\\S*ing\\S*/i{enter}');

    await waitFor(() => {
      expect(mockMultiSearch).toHaveBeenCalled();
    });

    const lastCallArgs = mockMultiSearch.mock.calls[mockMultiSearch.mock.calls.length - 1][0];
    expect(lastCallArgs.textSearch).toEqual(['\\S*ing\\S*']);
    expect(lastCallArgs.caseSensitive).toBe(false);
  });
});
