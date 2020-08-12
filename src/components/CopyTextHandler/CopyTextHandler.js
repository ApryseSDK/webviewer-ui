import React from 'react';
import './CopyTextHandler.scss';

const CopyTextHandler = () => (
  <div className="CopyTextHandler">
    <textarea id="copy-textarea" tabIndex={-1} aria-hidden />
  </div>
);

export default CopyTextHandler;
