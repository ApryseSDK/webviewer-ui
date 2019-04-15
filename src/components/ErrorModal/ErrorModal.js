import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './ErrorModal.scss';

class ErrorModal extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    openElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
    documentPath: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  }

  state = {
    errorMessage: ''
  }

  componentDidMount() {
    window.addEventListener('loaderror', this.onError);
    window.addEventListener('customErrorMessage', this.onError);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([ 'signatureModal', 'printModal', 'loadingModal', 'progressModal' ]);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('loaderror', this.onError);
    window.removeEventListener('customErrorMessage', this.onError);
  }

  onError = error => {
    const { openElement, documentPath, t } = this.props;

    openElement('errorModal');

    let errorMessage = '' + (error.detail || error.message);
    
    if (error.type === 'loaderror') {
      if (errorMessage.indexOf('File does not exist') > -1) {
        errorMessage = t('message.notSupported');
      }
      if (documentPath.indexOf('file:///') > -1) {
        console.error(`WebViewer doesn't have access to file URLs because of browser security restrictions. Please see https://www.pdftron.com/documentation/web/guides/basics/troubleshooting-document-loading#not-allowed-to-load-local-resource:-file:`);
      }
    }  

    this.setState({ errorMessage });
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    const { errorMessage } = this.state;
    const className = getClassName('Modal ErrorModal', this.props);

    return (
      <div className={className} data-element="errorModal">
        <div className="container">{errorMessage}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'errorModal'),
  isOpen: selectors.isElementOpen(state, 'errorModal'),
  documentPath: selectors.getDocumentPath(state)
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  closeElements: actions.closeElements,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(ErrorModal));