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
        <embed id="print-handler" type="application/pdf" tabIndex={-1}></embed>
      ) : (
        <div id="print-handler"></div>
      )}
    </div>
  );
};

export default PrintHandler;
