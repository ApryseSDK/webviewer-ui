import selectors from "selectors/index";
import actions from "actions/index";
import { connect } from "react-redux";
import React from "react";
import SearchOverlayContainer from "./SearchOverlayContainer";

const mapStateToProps = state => ({
  isSearchOverlayDisabled: selectors.isElementDisabled(state, 'searchOverlay'),
  searchValue: selectors.getSearchValue(state),
  isCaseSensitive: selectors.isCaseSensitive(state),
  isWholeWord: selectors.isWholeWord(state),
  isWildcard: selectors.isWildcard(state),
  isProcessingSearchResults: selectors.isProcessingSearchResults(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  setSearchValue: actions.setSearchValue,
  setCaseSensitive: actions.setCaseSensitive,
  setWholeWord: actions.setWholeWord,
  setWildcard: actions.setWildcard,
};

function SearchOverlayRedux(props) {
  return (<SearchOverlayContainer {...props} />);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchOverlayRedux);
