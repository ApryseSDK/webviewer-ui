import React, { useState } from 'react';
import RedactionSearchPanel from './RedactionSearchPanel';
import useOnRedactionSearchCompleted from 'hooks/useOnRedactionSearchCompleted';

const ReactionSearchPanelContainer = () => {
  const {
    redactionSearchResults,
    isProcessingRedactionResults,
    clearRedactionSearchResults,
    searchStatus,
    patternsInUse,
    setPatternsInUse
  } = useOnRedactionSearchCompleted();

  return (
    <RedactionSearchPanel
      redactionSearchResults={redactionSearchResults}
      isProcessingRedactionResults={isProcessingRedactionResults}
      clearRedactionSearchResults={clearRedactionSearchResults}
      searchStatus={searchStatus}
      searchTerms={patternsInUse}
      setSearchTerms={setPatternsInUse}
    />
  );
};

export default ReactionSearchPanelContainer;