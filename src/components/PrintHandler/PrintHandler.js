import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';

import core from 'core';
import { workerTypes } from 'constants/types';
import { isIOS } from 'helpers/device';
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
  const [documentType, setDocumentType] = useState('');

  useEffect(() => {
    const onDocumentLoaded = () => {
      const type = core.getDocument().getType();
      setDocumentType(type);
    };

    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => core.removeEventListener('documentLoaded', onDocumentLoaded);
  });

  return isDisabled ? null : (
    <div
      className={classNames({
        PrintHandler,
        'ios-print': isIOS,
      })}
    >
      {isEmbedPrintSupported && documentType === workerTypes.PDF ? (
        <iframe id="print-handler" tabIndex={-1}></iframe>
      ) : (
        <div id="print-handler"></div>
      )}
    </div>
  );
};

export default PrintHandler;
