import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import OfficeSuggestions from './OfficeSuggestions';
import actions from 'actions';
import selectors from 'selectors';
import useCore from 'hooks/useCore';
import DataElements from 'constants/dataElement';

const OfficeSuggestionsContainer = ({
  spellingErrorId,
  misspelledWord,
}) => {
  const { core } = useCore();
  const dispatch = useDispatch();
  const officeEditor = core.getOfficeEditor();
  const spellCheckManager = officeEditor?.getSpellCheckManager();
  const hasSpellingError = !!misspelledWord;

  const [suggestions, setSuggestions] = useState(null);

  const isSpellCheckSuggestionsDisabled = useSelector(
    (state) => selectors.isElementDisabled(state, DataElements.OFFICE_EDITOR_SPELL_CHECK_SUGGESTIONS),
  );

  const canShowSuggestions = !isSpellCheckSuggestionsDisabled &&
  hasSpellingError &&
  !!spellCheckManager?.isSpellCheckEnabled();
  const isLoadingSuggestions = suggestions === null;

  const getSpellCheckSuggestions = async () => {
    // Load the suggestions for misspelledWord with spellCheckManager.suggest here
    return [];
  };

  // eslint-disable-next-line no-unused-vars
  const replaceSpellingError = async (suggestion) => {
    // Replace the spelling error for spellingErrorId with suggestion using spellCheckManager here
  };

  useEffect(() => {
    setSuggestions(null);
    if (!canShowSuggestions) {
      return;
    }
    // Ignore results from a previous right-click that resolve after the menu has moved to another word
    let isCancelled = false;
    const loadSuggestions = async () => {
      const newSuggestions = await getSpellCheckSuggestions();
      if (!isCancelled) {
        setSuggestions(newSuggestions ?? []);
      }
    };
    loadSuggestions().catch((e) => {
      console.warn('Failed to load spell check suggestions', e);
    });
    return () => {
      isCancelled = true;
    };
  }, [spellingErrorId, misspelledWord, canShowSuggestions]);

  const handleSuggestionClick = async (suggestion) => {
    dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP));
    await replaceSpellingError(suggestion);
    officeEditor.focusContent();
  };

  if (!canShowSuggestions || isLoadingSuggestions) {
    return null;
  }

  return (
    <OfficeSuggestions
      suggestions={suggestions}
      handleSuggestionClick={handleSuggestionClick}
    />
  );
};

OfficeSuggestionsContainer.propTypes = {
  spellingErrorId: PropTypes.number,
  misspelledWord: PropTypes.string,
};

export default OfficeSuggestionsContainer;
