import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import RedactionSearchOverlay from 'src/components/RedactionSearchOverlay';
import { RedactionPanelContext } from 'components/RedactionPanel/RedactionPanelContext';
import RedactionSearchResults from 'components/RedactionSearchResults';
import Icon from 'components/Icon';
import { isMobileSize } from 'helpers/getDeviceSize';

const RedactionSearchPanel = (props) => {
  const dispatch = useDispatch();
  const [searchTerms, setSearchTerms] = useState([]);
  const { isRedactionSearchActive, setIsRedactionSearchActive } = useContext(RedactionPanelContext);
  const onCancelSearch = () => {
    setSearchTerms([]);
    clearRedactionSearchResults();
    setIsRedactionSearchActive(false);
  };

  const {
    redactionSearchResults,
    isProcessingRedactionResults,
    clearRedactionSearchResults,
    searchStatus,
  } = props;

  const isMobile = isMobileSize();

  const onCloseButtonClick = () => {
    dispatch(actions.closeElement('redactionPanel'));
  };

  return (
    <>
      {isMobile &&
        <div
          className="close-container"
        >
          <button
            className="close-icon-container"
            onClick={onCloseButtonClick}
          >
            <Icon
              glyph="ic_close_black_24px"
              className="close-icon"
            />
          </button>
        </div>}
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