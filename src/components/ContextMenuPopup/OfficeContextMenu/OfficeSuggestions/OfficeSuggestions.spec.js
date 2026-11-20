import React from 'react';
import i18next from 'i18next';
import { render, fireEvent, screen, within } from '@testing-library/react';
import { MAXIMUM_DISPLAYED_SUGGESTIONS } from 'constants/officeEditor';
import OfficeSuggestions from './OfficeSuggestions';

const renderSuggestions = (suggestions, handleSuggestionClick = jest.fn()) => {
  render(<OfficeSuggestions suggestions={suggestions} handleSuggestionClick={handleSuggestionClick} />);
  return { handleSuggestionClick };
};

const getSuggestionButtons = () => screen.queryAllByRole('button');

describe('OfficeSuggestions', () => {
  it('should render the suggestions label and a button for each suggestion', () => {
    const suggestions = ['their', 'there'];
    renderSuggestions(suggestions);

    expect(screen.getByText(i18next.t('officeEditor.spellCheck.suggestions'))).toBeInTheDocument();
    expect(getSuggestionButtons().map((button) => button.textContent)).toEqual(suggestions);
    expect(screen.queryByText(i18next.t('officeEditor.spellCheck.noSuggestions'))).not.toBeInTheDocument();
  });

  it('should expose the suggestions as a group named by the suggestions label', () => {
    const suggestions = ['their', 'there'];
    renderSuggestions(suggestions);

    const group = screen.getByRole('group', { name: i18next.t('officeEditor.spellCheck.suggestions') });
    expect(within(group).getAllByRole('button').map((button) => button.textContent)).toEqual(suggestions);
  });

  it(`should only render the first ${MAXIMUM_DISPLAYED_SUGGESTIONS} suggestions when more are provided`, () => {
    const suggestions = Array.from({ length: MAXIMUM_DISPLAYED_SUGGESTIONS + 2 }, (_, index) => `word${index}`);

    renderSuggestions(suggestions);

    expect(getSuggestionButtons().map((button) => button.textContent))
      .toEqual(suggestions.slice(0, MAXIMUM_DISPLAYED_SUGGESTIONS));
  });

  it('should render the no suggestions message when suggestions is an empty array', () => {
    renderSuggestions([]);

    expect(getSuggestionButtons()).toHaveLength(0);
    expect(screen.getByText(i18next.t('officeEditor.spellCheck.noSuggestions'))).toBeInTheDocument();
  });

  it('should pass the clicked suggestion to handleSuggestionClick', () => {
    const { handleSuggestionClick } = renderSuggestions(['their', 'there']);

    fireEvent.click(screen.getByRole('button', { name: 'there' }));

    expect(handleSuggestionClick).toHaveBeenCalledWith('there');
  });
});
