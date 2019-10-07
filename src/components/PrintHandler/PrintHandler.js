import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import selectors from 'selectors';

import './PrintHandler.scss';

const PrintHandler = () => {
  const [isDisabled, isEmbedPrintSupported] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'printHandler'),
      selectors.isEmbedPrintSupported(state),
    ],
    shallowEqual,
  );

  return isDisabled ? null : (
    <div className="PrintHandler">
      {isEmbedPrintSupported ? (
        <iframe id="print-handler" tabIndex={-1}></iframe>
      ) : (
        <div id="print-handler"></div>
      )}
    </div>
  );
};

export default PrintHandler;
