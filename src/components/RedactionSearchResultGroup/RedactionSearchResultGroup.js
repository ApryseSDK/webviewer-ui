import React, { useCallback, useEffect, useState } from 'react';
import RedactionSearchResult from './RedactionSearchResult';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import { useTranslation } from 'react-i18next';
import CollapsibleSection from 'components/CollapsibleSection';
import './RedactionSearchResultGroup.scss';

const RedactionSearchResultGroup = (props) => {
  const {
    pageNumber,
    searchResults,
    selectedSearchResultIndexes,
    setSelectedSearchResultIndexes,
  } = props;

  const { t } = useTranslation();
  const groupResultIndexes = searchResults.map((result) => result.index);
  const [allItemsChecked, setAllItemsChecked] = useState(false);

  useEffect(() => {
    const allResultsSelected = groupResultIndexes.reduce((allSelected, currentIndex) => {
      return selectedSearchResultIndexes[currentIndex] && allSelected;
    }, true);

    setAllItemsChecked(allResultsSelected);
  }, [selectedSearchResultIndexes, groupResultIndexes]);

  const checkAllResults = useCallback((event) => {
    const checked = event.target.checked;
    groupResultIndexes.forEach((resultIndex) => {
      selectedSearchResultIndexes[resultIndex] = checked;
    });
    setAllItemsChecked(checked);
    setSelectedSearchResultIndexes({ ...selectedSearchResultIndexes });
  }, [selectedSearchResultIndexes, groupResultIndexes]);

  const checkResult = useCallback((event, index) => {
    const checked = event.target.checked;
    selectedSearchResultIndexes[index] = checked;
    setSelectedSearchResultIndexes({ ...selectedSearchResultIndexes });
  }, [selectedSearchResultIndexes]);

  const header = () => {
    return (
      `${t('option.shared.page')} ${pageNumber}`
    );
  };

  const style = {
    width: '100%',
  };

  return (
    <div className="redaction-search-results-page-number">
      <Choice
        className="redaction-search-results-page-number-checkbox"
        aria-label={`${t('option.shared.page')} ${pageNumber}`}
        checked={allItemsChecked}
        onChange={(event) => {
          event.stopPropagation();
          checkAllResults(event);
        }}
      />
      <CollapsibleSection header={header} style={style} expansionDescription={`${t('option.shared.page')} ${pageNumber}`}>
        <div role="list">
          {searchResults.map((searchResult, index) => (
            <RedactionSearchResult
              checked={selectedSearchResultIndexes[searchResult.index]}
              checkResult={checkResult}
              searchResult={searchResult}
              key={`${index}-${pageNumber}`}
            />)
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default RedactionSearchResultGroup;