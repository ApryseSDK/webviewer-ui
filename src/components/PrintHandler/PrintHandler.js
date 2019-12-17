import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';

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

  return isDisabled ? null : (
    <div className={classNames({
      PrintHandler,
      'ios-print': isIOS,
    })}>
      {isEmbedPrintSupported ? (
        <iframe id="print-handler" tabIndex={-1}></iframe>
      ) : (
        <div id="print-handler"></div>
      )}
    </div>
  );
};

export default PrintHandler;
