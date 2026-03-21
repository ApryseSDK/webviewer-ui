import React, { useEffect, useRef } from 'react';
import DataElementWrapper from '../DataElementWrapper';
import RedactionSearchMultiSelect from './RedactionSearchMultiSelect';
import { redactionTypeMap } from 'constants/redactionTypes';
import './RedactionSearchOverlay.scss';
import { useTranslation } from 'react-i18next';
import { buildSearchOptions, parseRegexLiteral } from 'helpers/redactionSearchOptions';

const RedactionSearchOverlay = (props) => {
  const {
    setIsRedactionSearchActive,
    searchTerms,
    setSearchTerms,
    executeRedactionSearch,
    activeTheme,
    activeDocumentViewerKey,
    redactionSearchOptions,
  } = props;
  const [t] = useTranslation();
  const previousDocumentViewerKeyRef = useRef(activeDocumentViewerKey);

  const translatedOptions = redactionSearchOptions.map((option) => ({
    ...option,
    label: t(option.label),
  }));

  const handleChange = (updatedSearchTerms) => {
    setSearchTerms(updatedSearchTerms);
    const options = buildSearchOptions(updatedSearchTerms);
    executeRedactionSearch(options);
  };

  const handleCreate = (newValue) => {
    const parsedRegex = parseRegexLiteral(newValue);
    const textTerm = {
      label: newValue,
      value: newValue,
      type: redactionTypeMap['TEXT'],
      isRegex: Boolean(parsedRegex),
      regex: parsedRegex || undefined,
    };
    // Initially search terms are null so we safeguard against this
    const nonNullSearchTerms = searchTerms || [];
    const updatedSearchTerms = [...nonNullSearchTerms, textTerm];
    setSearchTerms(updatedSearchTerms);
    const options = buildSearchOptions(updatedSearchTerms);
    executeRedactionSearch(options);
  };

  useEffect(() => {
    const previousDocumentViewerKey = previousDocumentViewerKeyRef.current;
    const hasViewerSwitched = previousDocumentViewerKey !== activeDocumentViewerKey;
    if (hasViewerSwitched) {
      const emptySearchTerms = [];
      setSearchTerms(emptySearchTerms);
      const options = buildSearchOptions(emptySearchTerms);
      executeRedactionSearch(options);
      previousDocumentViewerKeyRef.current = activeDocumentViewerKey;
    }
  }, [activeDocumentViewerKey, executeRedactionSearch, setSearchTerms]);

  return (
    <DataElementWrapper
      className="RedactionSearchOverlay"
      dataElement="redactionSearchOverlay"
    >
      <RedactionSearchMultiSelect
        onFocus={() => setIsRedactionSearchActive(true)}
        value={searchTerms}
        onCreateOption={handleCreate}
        onChange={handleChange}
        activeTheme={activeTheme}
        redactionSearchOptions={translatedOptions}
      />

    </DataElementWrapper>

  );
};

export default RedactionSearchOverlay;
