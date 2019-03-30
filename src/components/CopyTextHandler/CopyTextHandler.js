import React from 'react';

import './CopyTextHandler.scss';

export default class CopyTextHandler extends React.PureComponent {
  render() {
    return (
      <div className="CopyTextHandler">
        <textarea tabIndex={-1} id="copy-textarea" />
      </div>
    );
  }
}
