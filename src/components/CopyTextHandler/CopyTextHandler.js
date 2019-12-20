import React from 'react';
import './CopyTextHandler.scss';

const CopyTextHandler = () => (
  <div className="CopyTextHandler">
    <textarea id="copy-textarea" tabIndex={-1} />
  </div>
);

export default CopyTextHandler;
