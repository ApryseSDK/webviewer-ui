import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import SearchResult from 'components/SearchResult';
import ListSeparator from 'components/ListSeparator';
import Button from 'components/Button';

import core from 'core';
import { isMobile, isTabletOrMobile } from 'helpers/device';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './SearchPanel.scss';

class SearchPanel extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.object),
    isSearching: PropTypes.bool,
    noResult: PropTypes.bool,
    setActiveResultIndex: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen && isTabletOrMobile()) {
      this.props.closeElement('leftPanel');  
    }
  }

  onClickResult = (resultIndex, result) => {
    const { setActiveResultIndex, closeElement } = this.props;

    setActiveResultIndex(resultIndex);
    core.setActiveSearchResult(result);
    
    if (isMobile()) {
      closeElement('searchPanel');
    }
  }

  onClickClose = () => {
    this.props.closeElement('searchPanel');
  }

  renderListSeparator = (prevResult, currResult) => {
    const isFirstResult = prevResult === currResult;
    const isInDifferentPage = prevResult.page_num !== currResult.page_num;

    if (isFirstResult || isInDifferentPage) {
      return (
        <ListSeparator
          renderContent={() => `Page ${currResult.page_num + 1}`}
        />
      );
    }
  
    return null;
  }

  render() {
    const { isDisabled, t, results, isSearching, noResult } = this.props;
    
    if (isDisabled) {
      return null;
    }

    const className = getClassName('Panel SearchPanel', this.props);

    return (
      <div className={className} data-element="searchPanel" onClick={e => e.stopPropagation()}>
        <Button className="close-btn hide-in-desktop hide-in-tablet" dataElement="searchPanelCloseButton" title="action.close" img="ic_close_black_24px" onClick={this.onClickClose} />
        <div className="results">
          {isSearching &&
            <div className="info">{t('message.searching')}</div>
          }
          {noResult &&
            <div className="info">{t('message.noResults')}</div>
          }
          {results.map((result, i) => {
            const prevResult = i === 0 ? results[0] : results[i - 1];

            return(
              <React.Fragment key={i}>
                {this.renderListSeparator(prevResult, result)}
                <SearchResult result={result} index={i} onClickResult={this.onClickResult} />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'searchPanel'),
  isOpen: selectors.isElementOpen(state, 'searchPanel'),
  results: selectors.getResults(state),
  isSearching: selectors.isSearching(state),
  noResult: selectors.isNoResult(state),
});

const mapDispatchToProps = {
  setActiveResultIndex: actions.setActiveResultIndex,
  closeElement: actions.closeElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SearchPanel));
