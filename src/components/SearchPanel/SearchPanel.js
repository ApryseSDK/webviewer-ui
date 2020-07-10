import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
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

const minWidth = 293;

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
      setSearchPanelWidth,
      currentWidth,
      isOpen,
      isDisabled,
      t,
      results,
      noResult,
      isMobile,
      isTabletAndMobile,
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
          </motion.div>
        )}
      </AnimatePresence>
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
  setSearchPanelWidth: actions.setSearchPanelWidth,
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
