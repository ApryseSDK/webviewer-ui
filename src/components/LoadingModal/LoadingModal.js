import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './LoadingModal.scss';

class LoadingModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    loadingMessage: PropTypes.string
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([ 'signatureModal', 'printModal', 'errorModal' ]);
    }
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    const className = getClassName('Modal LoadingModal', this.props);

    return (
      <div className={className} data-element="loadingModal">
        <div className="container">
          <div className="inner-wrapper"></div>
          <div className="text">{this.props.loadingMessage}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'loadingModal'),
  isOpen: selectors.isElementOpen(state, 'loadingModal'),
  loadingMessage: selectors.getLoadingMessage(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingModal);