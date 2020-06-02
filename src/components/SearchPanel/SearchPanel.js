import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import SearchResult from 'components/SearchResult';
import ListSeparator from 'components/ListSeparator';
import ResizeBar from 'components/ResizeBar';
import SearchOverlay from 'components/SearchOverlay';
import Icon from 'components/Icon';

import core from 'core';
// import { isMobile, isTabletOrMobile } from 'helpers/device';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';

import './SearchPanel.scss';
import { motion, AnimatePresence } from "framer-motion";

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
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      // if (isTabletOrMobile()) {
      //   this.props.closeElements(['leftPanel']);
      // }

      // this.props.closeElements(['notesPanel']);
    }
  }

  onClickResult = (resultIndex, result) => {
    const { setActiveResultIndex, closeElements, isMobile } = this.props;

    setActiveResultIndex(resultIndex);
    core.setActiveSearchResult(result);

    if (isMobile) {
      closeElements('searchPanel');
    }
  };

  onClickClose = () => {
    this.props.closeElements('searchPanel');
  };

  renderListSeparator = (prevResult, currResult) => {
    const isFirstResult = prevResult === currResult;
    const isInDifferentPage = prevResult.page_num !== currResult.page_num;

    if (isFirstResult || isInDifferentPage) {
      return (
        <ListSeparator
          renderContent={() =>
            `${this.props.t('option.shared.page')} ${
              this.props.pageLabels[currResult.page_num]
            }`
          }
        />
      );
    }

    return null;
  };

  render() {
    const { setSearchPanelWidth, currentWidth, isOpen, isDisabled, t, results, noResult, isMobile, isTabletAndMobile, closeElements } = this.props;

    if (isDisabled) {
      return null;
    }

    const className = getClassName('Panel SearchPanel', this.props);

    let style = {};
    if (!isMobile) {
      style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
    }

    const isVisible = !(!isOpen || isDisabled);

    let animate = { width: 'auto' };
    if (isMobile) {
      animate = { width: '100vw' };
    }

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="search-panel-container"
            initial={{ width: '0px' }}
            animate={animate}
            exit={{ width: '0px' }}
            transition={{ ease: "easeOut", duration: 0.25 }}
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
              <div className={`results`}>
                {noResult && <div className="info">{t('message.noResults')}</div>}
                {results.map((result, i) => {
                  const prevResult = i === 0 ? results[0] : results[i - 1];

                  return (
                    <React.Fragment key={i}>
                      {this.renderListSeparator(prevResult, result)}
                      <SearchResult
                        result={result}
                        index={i}
                        onClickResult={this.onClickResult}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
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
