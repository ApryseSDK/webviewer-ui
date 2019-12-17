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

  let containerClass = 'PrintHandler';
  if (isIOS) {
    containerClass += ' ios-print';
  }

  return isDisabled ? null : (
    <div className={containerClass}>
      {isEmbedPrintSupported ? (
        <iframe id="print-handler" tabIndex={-1}></iframe>
      ) : (
        <div id="print-handler"></div>
      )}
    </div>
  );
};

export default PrintHandler;
