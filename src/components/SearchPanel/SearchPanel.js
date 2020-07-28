import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { isSafari } from 'src/helpers/device';

import SearchResult from 'components/SearchResult';
import ResizeBar from 'components/ResizeBar';
import SearchOverlay from 'components/SearchOverlay';
import Icon from 'components/Icon';
import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';

import './SearchPanel.scss';
import useSearch from "hooks/useSearch";

const minWidth = 293;

class SearchPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    searchStatus: PropTypes.oneOf(['SEARCH_NOT_INITIATED', 'SEARCH_IN_PROGRESS', 'SEARCH_DONE']),
    searchResults: PropTypes.arrayOf(PropTypes.object),
    closeElements: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    pageLabels: PropTypes.array.isRequired,
    setSearchPanelWidth: PropTypes.func,
    currentWidth: PropTypes.number,
    activeSearchResultIndex: PropTypes.number,
    isMobile: PropTypes.bool,
    isTabletAndMobile: PropTypes.bool,
  };

  onClickResult = (resultIndex, result) => {
    const { closeElements, isMobile } = this.props;
    core.setActiveSearchResult(result);

    if (isMobile) {
      closeElements('searchPanel');
    }
  };

  render() {
    const {
      setSearchPanelWidth,
      currentWidth,
      isOpen,
      isDisabled,
      t,
      searchStatus,
      searchResults,
      isMobile,
      isTabletAndMobile,
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

    let animate = { width: 'auto' };
    if (isMobile) {
      animate = { width: '100vw' };
    }
    
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="search-panel-container"
            initial={{ width: '0px' }}
            animate={animate}
            exit={{ width: '0px' }}
            transition={{ ease: "easeOut", duration: isSafari ? 0 : 0.25 }}
          >
            {!isTabletAndMobile &&
              <ResizeBar
                minWidth={minWidth}
                onResize={_width => {
                  setSearchPanelWidth(_width);
                }}
                leftDirection
              />}
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
                t={t}
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
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'searchPanel'),
  isOpen: selectors.isElementOpen(state, 'searchPanel'),
  errorMessage: selectors.getSearchErrorMessage(state),
  currentWidth: selectors.getSearchPanelWidth(state),
  pageLabels: selectors.getPageLabels(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  setSearchPanelWidth: actions.setSearchPanelWidth,
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
