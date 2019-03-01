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
    pageLabels: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      input: '',
      isCustomPageLabels: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pageLabels !== this.props.pageLabels) {
      const isCustomPageLabels = this.props.pageLabels.some((label, index) => label !== `${index + 1}`);
      this.setState({ isCustomPageLabels });   
    }

    if (prevProps.currentPage !== this.props.currentPage || prevProps.pageLabels !== this.props.pageLabels) {
      this.setState({ input: this.props.pageLabels[this.props.currentPage - 1] });
    }

    if (prevProps.totalPages !== this.props.totalPages && !this.props.isDisabled) {
      this.setInputWidth();
    }

    if (prevProps.isDisabled && !this.props.isDisabled) {
      this.setInputWidth();
    }
  }
  
  setInputWidth = () => {
    this.textInput.current.style.width = (this.props.totalPages.toString().length * 11.5) + 'px';
  }

  onClick = () => {
    this.textInput.current.focus();
  }

  onChange = e => {
    if (e.target.value.length > this.props.totalPages.toString().length) {
      return;
    }

    this.setState({ input: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();
    
    const { input } = this.state;
    const isValidInput = input === '' || this.props.pageLabels.includes(input);

    if (isValidInput) {
      const pageToGo = this.props.pageLabels.indexOf(input) + 1;
      core.setCurrentPage(pageToGo);
    } else {
      this.textInput.current.blur();
    }
  }

  onBlur = () => {
    const { currentPage, pageLabels } = this.props;

    this.setState({ input: pageLabels[currentPage - 1] });
  }

  render() {
    const { isDisabled, isLeftPanelOpen, isLeftPanelDisabled, currentPage, totalPages } = this.props;
    if (isDisabled) {
      return null;
    }

    const className = getClassName(`Overlay PageNavOverlay ${isLeftPanelOpen && !isLeftPanelDisabled ? 'shifted' : ''}`, this.props);
    
    return (
      <div className={className} data-element="pageNavOverlay" onClick={this.onClick}>
        <form onSubmit={this.onSubmit} onBlur={this.onBlur}>
          <input ref={this.textInput} type="text" value={this.state.input} onChange={this.onChange} />
          {this.state.isCustomPageLabels 
          ? ` (${currentPage}/${totalPages})`
          : ` / ${totalPages}`
          }
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
  pageLabels: selectors.getPageLabels(state)
});

export default connect(mapStateToProps)(PageNavOverlay);