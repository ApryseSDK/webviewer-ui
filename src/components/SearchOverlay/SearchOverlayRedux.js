import selectors from 'selectors';
import actions from 'actions';
import { connect } from 'react-redux';
import React from 'react';
import SearchOverlayContainer from './SearchOverlayContainer';
import DataElements from 'src/constants/dataElement';

const mapStateToProps = (state) => ({
  isSearchOverlayDisabled: selectors.isElementDisabled(state, DataElements.SEARCH_OVERLAY),
  searchValue: selectors.getSearchValue(state),
  replaceValue: selectors.getReplaceValue(state),
  nextResultValue: selectors.getNextResultValue(state),
  isCaseSensitive: selectors.isCaseSensitive(state),
  isWholeWord: selectors.isWholeWord(state),
  isWildcard: selectors.isWildcard(state),
  isProcessingSearchResults: selectors.isProcessingSearchResults(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  setSearchValue: actions.setSearchValue,
  setReplaceValue: actions.setReplaceValue,
  setCaseSensitive: actions.setCaseSensitive,
  setWholeWord: actions.setWholeWord,
  setWildcard: actions.setWildcard,
};

function SearchOverlayRedux(props) {
  return (<SearchOverlayContainer {...props} />);
}

const ConnectedSearchOverlayRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchOverlayRedux);

const connectedComponent = (props) => {
  return <ConnectedSearchOverlayRedux {...props} />;
};

export default connectedComponent;