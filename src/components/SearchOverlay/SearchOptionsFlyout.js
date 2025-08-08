import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DataElements from 'src/constants/dataElement';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import Choice from 'components/Choice/Choice';
import './SearchOptionsFlyout.scss';

const SearchOptionsFlyout = ({
  isPanelOpen,
  isCaseSensitive,
  isWholeWord,
  isWildcard,
  onCaseSensitiveSearchOptionChange,
  wholeWordSearchOptionOnChange,
  wildcardOptionOnChange,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const flyoutSelector = DataElements.SEARCH_OPTIONS_FLYOUT;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));

  useLayoutEffect(() => {
    const searchOptionsFlyout = {
      dataElement: flyoutSelector,
      className: 'SearchOptionsFlyout',
      items: [
        {
          type: 'customElement',
          render: () => (
            <Choice
              dataElement={DataElements.CASE_SENSITIVE_SEARCH_OPTION}
              id="case-sensitive-option"
              checked={isCaseSensitive}
              onChange={onCaseSensitiveSearchOptionChange}
              label={t('option.searchPanel.caseSensitive')}
              tabIndex={isPanelOpen ? 0 : -1}
            />
          ),
        },
        {
          type: 'customElement',
          render: () => (
            <Choice
              dataElement={DataElements.WHOLE_WORD_SEARCH_OPTION}
              id="whole-word-option"
              checked={isWholeWord}
              onChange={wholeWordSearchOptionOnChange}
              label={t('option.searchPanel.wholeWordOnly')}
              tabIndex={isPanelOpen ? 0 : -1}
            />
          ),
        },
        {
          type: 'customElement',
          render: () => (
            <Choice
              dataElement={DataElements.WILD_CARD_SEARCH_OPTION}
              id="wildcard-option"
              checked={isWildcard}
              onChange={wildcardOptionOnChange}
              label={t('option.searchPanel.wildcard')}
              tabIndex={isPanelOpen ? 0 : -1}
            />
          ),
        },
      ],
    };

    if (!currentFlyout) {
      dispatch(actions.addFlyout(searchOptionsFlyout));
    } else {
      dispatch(actions.updateFlyout(searchOptionsFlyout.dataElement, searchOptionsFlyout));
    }
  }, [isCaseSensitive, isWholeWord, isWildcard, isPanelOpen, onCaseSensitiveSearchOptionChange, wholeWordSearchOptionOnChange, wildcardOptionOnChange]);

  return null;
};

SearchOptionsFlyout.propTypes = {
  isCaseSensitive: PropTypes.bool.isRequired,
  isWholeWord: PropTypes.bool.isRequired,
  isWildcard: PropTypes.bool.isRequired,
  isPanelOpen: PropTypes.bool,
  onCaseSensitiveSearchOptionChange: PropTypes.func.isRequired,
  wholeWordSearchOptionOnChange: PropTypes.func.isRequired,
  wildcardOptionOnChange: PropTypes.func.isRequired,
};

export default SearchOptionsFlyout;
