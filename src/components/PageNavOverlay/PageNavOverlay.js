import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import getClassName from 'helpers/getClassName';
import selectors from 'selectors';

import './PageNavOverlay.scss';

class PageNavOverlay extends React.PureComponent {
  static propTypes = {
    isLeftPanelDisabled: PropTypes.bool,
    isLeftPanelOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      input: 0
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPage !== this.props.currentPage) {
      this.setState({ input: this.props.currentPage });
    }
  }

  onClick = () => {
    this.textInput.current.focus();
  }

  onInput = e => {
    const { value } = e.target;
    const isValidInput = value === '' || Number(value) > 0 && Number(value) <= this.props.totalPages;

    if (isValidInput) {
      this.setState({ input: value });
    }
  }

  onSubmit = e => {
    e.preventDefault();
    
    const { input } = this.state;

    if (input) {
      const pageToGo = Number(input);
      core.setCurrentPage(pageToGo);
    }
  }

  onBlur = () => {
    this.setState({ input: this.props.currentPage });
  }

  render() {
    const { isDisabled, isLeftPanelOpen, isLeftPanelDisabled, totalPages } = this.props;
    
    if (isDisabled) {
      return null;
    }

    const inputWidth = totalPages.toString().length * 10;
    const className = getClassName(`Overlay PageNavOverlay ${isLeftPanelOpen && !isLeftPanelDisabled ? 'shifted' : ''}`, this.props);
    
    return (
      <div className={className} data-element="pageNavOverlay" onClick={this.onClick}>
        <form onSubmit={this.onSubmit} onBlur={this.onBlur}>
          <input ref={this.textInput} type="text" value={this.state.input} style={{ width: inputWidth }} onInput={this.onInput} />
          {` / ${totalPages}`}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLeftPanelDisabled: selectors.isElementDisabled(state, 'leftPanel'),
  isLeftPanelOpen: selectors.isElementOpen(state, 'leftPanel'),
  isDisabled: selectors.isElementDisabled(state, 'pageNavOverlay'),
  isOpen: selectors.isElementOpen(state, 'pageNavOverlay'),
  currentPage: selectors.getCurrentPage(state),
  totalPages: selectors.getTotalPages(state),
});

export default connect(mapStateToProps)(PageNavOverlay);