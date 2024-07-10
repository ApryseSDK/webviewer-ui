import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';

import './LoadingModal.scss';

class LoadingModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([
        DataElements.SIGNATURE_MODAL,
        DataElements.PRINT_MODAL,
        DataElements.ERROR_MODAL,
      ]);
    }
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    const className = getClassName('Modal LoadingModal', this.props);

    return (
      <div className={className} data-element={DataElements.LOADING_MODAL}>
        <div className="container">
          <div className="inner-wrapper"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isDisabled: selectors.isElementDisabled(state, DataElements.LOADING_MODAL),
  isOpen: selectors.isElementOpen(state, DataElements.LOADING_MODAL),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingModal);