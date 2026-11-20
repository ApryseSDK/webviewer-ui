import React from 'react';
import ReactDOM from 'react-dom';
import { withTranslation } from 'react-i18next';
import './NetworkErrorWrapper.scss';
import PropTypes from 'prop-types';
import ToastContainerContext from 'components/App/ToastContainerContext';

const propTypes = {
  t: PropTypes.func,
  children: PropTypes.any,
  dataElement: PropTypes.string,
};

class NetworkErrorWrapper extends React.Component {
  static contextType = ToastContainerContext;

  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, dismissed: false };
    this.t = props.t || ((str) => str);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  checkIsChunkLoadError = () => {
    const { error } = this.state;
    const message = error?.message || '';
    return message.includes('Loading chunk')
      || message.includes('Loading CSS chunk')
      || message.includes('Failed to fetch dynamically imported module') // Chrome / Edge
      || message.includes('error loading dynamically imported module') // Firefox
      || message.includes('Importing a module script failed'); // Safari
  };

  handleCloseError = () => {
    this.setState({ hasError: false, error: null, dismissed: true });
  };

  render() {
    if (this.state.hasError && this.checkIsChunkLoadError()) {
      const toast = <div role='alert' className='ErrorToast'>
        <div className='ErrorToastContent'>
          <div>{this.t('message.networkError')} &quot;{this.props.dataElement}&quot;</div>
          <div>{this.t('message.refreshPage')}</div>
        </div>
        <button type='button' className='ErrorToastClose' onClick={this.handleCloseError} aria-label={this.t('action.close')}>
          ×
        </button>
      </div>;
      const container = this.context;
      return container ? ReactDOM.createPortal(toast, container) : toast;
    }
    if (this.state.hasError) {
      // Non-chunk errors should be re-thrown to outer error boundary
      throw this.state.error;
    }
    // If the user dismissed the error, don't try to render children again (they will fail to load again)
    if (this.state.dismissed) {
      return null;
    }
    return this.props.children;
  }
}

NetworkErrorWrapper.propTypes = propTypes;

export default withTranslation()(NetworkErrorWrapper);
