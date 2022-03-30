import React from 'react';
import DataElementWrapper from '../DataElementWrapper';
import RedactionSearchMultiSelect from './RedactionSearchMultiSelect';
import { redactionTypeMap } from '../RedactionPageGroup/RedactionItem/RedactionItem';
import './RedactionSearchOverlay.scss';

const buildSearchOptions = (searchTerms) => {
  const options = {
    textSearch: [],
  };

  if (!searchTerms) {
    return options;
  }

  searchTerms.forEach(searchTerm => {
    const { type } = searchTerm;
    switch (type) {
      case redactionTypeMap['CREDIT_CARD']:
        options.creditCards = true;
        break;
      case redactionTypeMap['EMAIL']:
        options.emails = true;
        break;
      case redactionTypeMap['PHONE']:
        options.phoneNumbers = true;
        break;
      case redactionTypeMap['IMAGE']:
        options.images = true;
        break;
      case redactionTypeMap['TEXT']:
        options.textSearch.push(searchTerm.label);
        break;
    }
  });

  return options;
}

const RedactionSearchOverlay = (props) => {
  const {
    setIsRedactionSearchActive,
    searchTerms,
    setSearchTerms,
    executeRedactionSearch
  } = props;

  const handleChange = (
    updatedSearchTerms,
  ) => {
    setSearchTerms(updatedSearchTerms);
    const options = buildSearchOptions(updatedSearchTerms);
    executeRedactionSearch(options);
  };

  const handleCreate = (newValue) => {
    const textTerm = {
      label: newValue,
      value: newValue,
      type: redactionTypeMap['TEXT']
    }
    //Initially search terms are null so we safeguard against this
    const nonNullSearchTerms = searchTerms ? searchTerms : [];
    const updatedSearchTerms = [...nonNullSearchTerms, textTerm];
    setSearchTerms(updatedSearchTerms);
    const options = buildSearchOptions(updatedSearchTerms);
    executeRedactionSearch(options);
  };

  const textInputOnKeyUp = (event) => {
    if (event.key === 'Enter') {
      const options = buildSearchOptions(searchTerms);
      executeRedactionSearch(options);
    }
  }
  return (
    <DataElementWrapper
      className="RedactionSearchOverlay"
      dataElement="redactionSearchOverlay"
      onKeyUp={textInputOnKeyUp}
    >
      <RedactionSearchMultiSelect
        onFocus={() => setIsRedactionSearchActive(true)}
        value={searchTerms}
        onCreateOption={handleCreate}
        onChange={handleChange}
      />

    </DataElementWrapper>

  )
};

export default RedactionSearchOverlay;