import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import selectors from 'selectors';
import { isIOS } from 'helpers/device';

import './PrintHandler.scss';

const PrintHandler = () => {
  const [isDisabled, isEmbedPrintSupported] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'printHandler'),
      selectors.isEmbedPrintSupported(state),
    ],
    shallowEqual,
  );

  let containerStyle;
  if (isIOS) {
    // workaround for getting safari to print to the whole page
    containerStyle = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      position: 'absolute',
    };
  }

  return isDisabled ? null : (
    <div className="PrintHandler" style={containerStyle}>
      {isEmbedPrintSupported ? (
        <iframe id="print-handler" tabIndex={-1}></iframe>
      ) : (
        <div id="print-handler"></div>
      )}
    </div>
  );
};

export default PrintHandler;
