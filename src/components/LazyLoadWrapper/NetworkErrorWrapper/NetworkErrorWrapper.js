import React from 'react';
import { withTranslation } from 'react-i18next';
import './NetworkErrorWrapper.scss';
import PropTypes from 'prop-types';

const propTypes = {
  t: PropTypes.func,
  children: PropTypes.any,
  dataElement: PropTypes.string,
};

let zIndexCounter = 100;

class NetworkErrorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, zIndex: zIndexCounter++ };
    this.t = props.t || ((str) => str);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  checkIsChunkLoadError = () => {
    const { error } = this.state;
    return error?.message?.includes('Loading chunk') || error?.message?.includes('Loading CSS chunk');
  };

  render() {
    if (this.checkIsChunkLoadError()) {
      return <div role='alert' className='ErrorToast' style={{ zIndex: this.state.zIndex }} >
        <div>{this.t('message.networkError')} &quot;{this.props.dataElement}&quot;</div>
        <div>{this.t('message.refreshPage')}</div>
      </div>;
    }
    return this.props.children;
  }
}

NetworkErrorWrapper.propTypes = propTypes;

export default withTranslation()(NetworkErrorWrapper);