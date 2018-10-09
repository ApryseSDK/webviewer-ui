import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import selectors from 'selectors';

import './PrintHandler.scss';

class PrintHandler extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isEmbedPrintSupported: PropTypes.bool
  }

  render() {
    if (this.props.isDisabled) {
      return null;
    }

    return (
      <div className="PrintHandler">
        {this.props.isEmbedPrintSupported
          ? <embed id="print-handler" type="application/pdf"></embed>
          : <div id="print-handler"></div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'printHandler'),
  isEmbedPrintSupported: selectors.isEmbedPrintSupported(state)
});

export default connect(mapStateToProps)(PrintHandler);