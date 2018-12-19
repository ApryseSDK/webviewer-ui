import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './ProgressModal.scss';

class ProgressModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([ 'signatureModal', 'printModal', 'errorModal', 'loadingModal' ]);
    }
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    const className = getClassName('Modal ProgressModal', this.props);

    return (
      <div className={className} data-element="progressModal">
        <div className="container">
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{ transform: `translateX(${-(1 - this.props.loadingProgress) * 100}%`}}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'progressModal'),
  isOpen: selectors.isElementOpen(state, 'progressModal'),
  loadingProgress: selectors.getLoadingProgress(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements
};

export default connect(mapStateToProps, mapDispatchToProps)(ProgressModal);