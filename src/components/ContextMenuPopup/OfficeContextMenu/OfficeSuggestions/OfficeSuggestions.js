import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import DataElements from 'constants/dataElement';
import { MAXIMUM_DISPLAYED_SUGGESTIONS } from 'constants/officeEditor';

const SUGGESTIONS_LABEL_ID = 'office-editor-spellcheck-suggestions-label';

const OfficeSuggestions = ({ suggestions, handleSuggestionClick }) => {
  const [t] = useTranslation();

  const displayedSuggestions = suggestions ? suggestions.slice(0, MAXIMUM_DISPLAYED_SUGGESTIONS) : [];

  return (
    <div
      className="office-suggestions"
      data-element={DataElements.OFFICE_EDITOR_SPELL_CHECK_SUGGESTIONS}
      role="group"
      aria-labelledby={SUGGESTIONS_LABEL_ID}
    >
      <div id={SUGGESTIONS_LABEL_ID} className="spellcheck-suggestions-label">
        {t('officeEditor.spellCheck.suggestions')}
      </div>
      {displayedSuggestions.length > 0 ? (
        displayedSuggestions.map((suggestion, index) => (
          <button
            key={`${suggestion}-${index}`}
            type="button"
            className={classNames('office-action-item', 'spellcheck-suggestion')}
            onClick={(e) => {
              handleSuggestionClick(suggestion);
              // prevent bubbling up click event so the popup's own click handler does not also close the context menu
              e.stopPropagation();
            }}
          >
            {suggestion}
          </button>
        ))
      ) : (
        <div
          className="no-suggestions spellcheck-suggestion"
        >
          {t('officeEditor.spellCheck.noSuggestions')}
        </div>
      )}
      <div className="divider"/>
    </div>
  );
};

OfficeSuggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string),
  handleSuggestionClick: PropTypes.func,
};

export default React.memo(OfficeSuggestions);
