import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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
import useSearch from "hooks/useSearch";

class SearchPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    searchStatus: PropTypes.oneOf(['SEARCH_NOT_INITIATED', 'SEARCH_IN_PROGRESS', 'SEARCH_DONE']),
    searchResults: PropTypes.arrayOf(PropTypes.object),
    closeElements: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    pageLabels: PropTypes.array.isRequired,
    setSearchPanelWidth: PropTypes.func,
    currentWidth: PropTypes.number,
    activeSearchResultIndex: PropTypes.number,
    isMobile: PropTypes.bool,
    isTabletAndMobile: PropTypes.bool,
  };

  componentWillUnmount() {
    core.clearSearchResults();
  }

  onClickResult = (resultIndex, result) => {
    const { closeElements, isMobile } = this.props;
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
      searchStatus,
      searchResults,
      isMobile,
      closeElements,
      activeSearchResultIndex,
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
        <SearchOverlay
          searchResults={searchResults}
          activeResultIndex={activeSearchResultIndex}
        />
        <SearchResult
          t={t}
          searchStatus={searchStatus}
          searchResults={searchResults}
          activeResultIndex={activeSearchResultIndex}
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
  currentWidth: selectors.getSearchPanelWidth(state),
  pageLabels: selectors.getPageLabels(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
};

const SearchPanelRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPanel);

export default props => {
  const isMobile = useMedia(['(max-width: 640px)'],[true], false);
  const isTabletAndMobile = useMedia(['(max-width: 900px)'], [true], false);
  const { t } = useTranslation();
  const { searchStatus, searchResults, activeSearchResultIndex } = useSearch();

  const combinedProps = {
    ...props,
    isMobile,
    isTabletAndMobile,
    t,
    searchStatus,
    searchResults,
    activeSearchResultIndex
  };

  return (
    <SearchPanelRedux {...combinedProps} />
  );
};
