import React from 'react';
import RedactionSearchPanel from './RedactionSearchPanel';
import useOnRedactionSearchCompleted from 'hooks/useOnRedactionSearchCompleted';

const ReactionSearchPanelContainer = () => {

  const {
    redactionSearchResults,
    isProcessingRedactionResults,
    clearRedactionSearchResults,
    searchStatus,
  } = useOnRedactionSearchCompleted();

  return (
    <RedactionSearchPanel
      redactionSearchResults={redactionSearchResults}
      isProcessingRedactionResults={isProcessingRedactionResults}
      clearRedactionSearchResults={clearRedactionSearchResults}
      searchStatus={searchStatus}
    />
  );
};

export default ReactionSearchPanelContainer