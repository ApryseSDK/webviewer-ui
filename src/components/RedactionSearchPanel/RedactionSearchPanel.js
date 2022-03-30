import React, { useContext, useState } from 'react';
import RedactionSearchOverlay from 'src/components/RedactionSearchOverlay';
import { RedactionPanelContext } from 'components/RedactionPanel/RedactionPanelContext';
import RedactionSearchResults from 'components/RedactionSearchResults';

const RedactionSearchPanel = (props) => {
  const [searchTerms, setSearchTerms] = useState([]);
  const { isRedactionSearchActive, setIsRedactionSearchActive } = useContext(RedactionPanelContext)
  const onCancelSearch = () => {
    setSearchTerms([]);
    clearRedactionSearchResults();
    setIsRedactionSearchActive(false)
  };

  const {
    redactionSearchResults,
    isProcessingRedactionResults,
    clearRedactionSearchResults,
    searchStatus,
  } = props;

  return (
    <>
      <RedactionSearchOverlay
        searchTerms={searchTerms}
        setSearchTerms={setSearchTerms}
      />
      {isRedactionSearchActive &&
        <RedactionSearchResults
          redactionSearchResults={redactionSearchResults}
          onCancelSearch={onCancelSearch}
          searchStatus={searchStatus}
          isProcessingRedactionResults={isProcessingRedactionResults}
        />
      }
    </>
  );
};

export default RedactionSearchPanel;