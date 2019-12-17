import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import selectors from 'selectors';
import { isIOS } from 'helpers/device';

import './PrintHandler.scss';

class PrintHandler extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isEmbedPrintSupported: PropTypes.bool,
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    let className = 'PrintHandler';
    if (isIOS) {
      className += ' ios-print';
    }

    return (
      <div className={className}>
        {this.props.isEmbedPrintSupported
          ? <iframe id="print-handler"></iframe>
          : <div id="print-handler"></div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'printHandler'),
  isEmbedPrintSupported: selectors.isEmbedPrintSupported(state),
});

export default connect(mapStateToProps)(PrintHandler);