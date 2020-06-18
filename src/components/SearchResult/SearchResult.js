import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import selectors from 'selectors';

import './SearchResult.scss';

class SearchResult extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    result: PropTypes.object.isRequired,
    activeResultIndex: PropTypes.number.isRequired,
    onClickResult: PropTypes.func.isRequired,
  };

  onClick = () => {
    const { onClickResult, index, result } = this.props;

    onClickResult(index, result);
  }

  renderContent = () => {
    const { ambientStr, resultStrStart, resultStrEnd } = this.props.result;
    const textBeforeSearchValue = ambientStr.slice(0, resultStrStart);
    const searchValue = ambientStr.slice(resultStrStart, resultStrEnd);
    const textAfterSearchValue = ambientStr.slice(resultStrEnd);

    return (
      <React.Fragment>
        {textBeforeSearchValue}
        <span className="search-value">
          {searchValue}
        </span>
        {textAfterSearchValue}
      </React.Fragment>
    );
  }

  render() {
    const { activeResultIndex, index } = this.props;

    return (
      <div className={`SearchResult ${index === activeResultIndex ? 'selected' : ''}`} onClick={this.onClick}>
        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeResultIndex: selectors.getActiveResultIndex(state),
});

export default connect(mapStateToProps)(SearchResult);