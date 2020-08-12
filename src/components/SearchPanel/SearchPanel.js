import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import SearchResult from 'components/SearchResult';
import SearchOverlay from 'components/SearchOverlay';
import Icon from 'components/Icon';
import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';

import './SearchPanel.scss';

class SearchPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.object),
    isSearching: PropTypes.bool,
    noResult: PropTypes.bool,
    setActiveResultIndex: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    pageLabels: PropTypes.array.isRequired,
    setSearchPanelWidth: PropTypes.func,
    currentWidth: PropTypes.number,
    activeResultIndex: PropTypes.number,
    isMobile: PropTypes.bool,
    isTabletAndMobile: PropTypes.bool,
  };

  onClickResult = (resultIndex, result) => {
    const { setActiveResultIndex, closeElements, isMobile } = this.props;

    setActiveResultIndex(resultIndex);
    core.setActiveSearchResult(result);

    if (isMobile) {
      closeElements('searchPanel');
    }
  };

  render() {
    const {
      currentWidth,
      isDisabled,
      t,
      results,
      noResult,
      isMobile,
      closeElements,
      activeResultIndex,
      pageLabels
    } = this.props;

    if (isDisabled) {
      return null;
    }

    const className = getClassName('Panel SearchPanel', this.props);

    let style = {};
    if (!isMobile) {
      style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
    }

    return (
      <div
        className={className}
        data-element="searchPanel"
        style={style}
      >
        {isMobile &&
          <div
            className="close-container"
          >
            <button
              className="close-icon-container"
              onClick={() => {
                closeElements(['searchPanel']);
              }}
            >
              <Icon
                glyph="ic_close_black_24px"
                className="close-icon"
              />
            </button>
          </div>}
        <SearchOverlay />
        <SearchResult
          translate={t}
          noSearchResult={noResult}
          searchResults={results}
          activeResultIndex={activeResultIndex}
          onClickResult={this.onClickResult}
          pageLabels={pageLabels}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'searchPanel'),
  isOpen: selectors.isElementOpen(state, 'searchPanel'),
  results: selectors.getResults(state),
  activeResultIndex: selectors.getActiveResultIndex(state),
  isSearching: selectors.isSearching(state),
  noResult: selectors.isNoResult(state),
  errorMessage: selectors.getSearchErrorMessage(state),
  currentWidth: selectors.getSearchPanelWidth(state),
  pageLabels: selectors.getPageLabels(state),
});

const mapDispatchToProps = {
  setActiveResultIndex: actions.setActiveResultIndex,
  closeElements: actions.closeElements,
};

const ConnectedSearchPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(SearchPanel));

export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const isTabletAndMobile = useMedia(
    // Media queries
    ['(max-width: 900px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedSearchPanel {...props} isMobile={isMobile} isTabletAndMobile={isTabletAndMobile} />
  );
};
