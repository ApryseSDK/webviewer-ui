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
    closeElements: PropTypes.func.isRequired,
    loadingProgress: PropTypes.number,
    isUploading: PropTypes.bool,
    uploadProgress: PropTypes.number,
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements(['signatureModal', 'printModal', 'errorModal', 'loadingModal']);
    }
  }

  render() {
    const { isDisabled, loadingProgress, isUploading, uploadProgress } = this.props;

    if (isDisabled) {
      return null;
    }

    const progressToUse = isUploading ? uploadProgress : loadingProgress;
    const className = getClassName('Modal ProgressModal', this.props);

    return (
      <div className={className} data-element="progressModal">
        <div className="container">
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{ transform: `translateX(${-(1 - progressToUse) * 100}%`, transition: progressToUse ? 'transform 0.5s ease' : 'none' }}>
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
  isUploading: selectors.isUploading(state),
  uploadProgress: selectors.getUploadProgress(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProgressModal);