import React from 'react';
import ReactToolTip from 'react-tooltip';

import './ToolTip.scss';

class ToolTip extends React.PureComponent {
  getContent = data => {
    if (!data) {
      return null;
    }

    // Tooltip format: content (shortcut)
    const content = data.split('(')[0];
    const hasShortcut = data.indexOf('(') > -1;
    const shortcut = hasShortcut ? `(${data.split('(')[1]}` : '';

    return (
      <div>
        {content}
        {hasShortcut &&
          <span className="shortcut">{shortcut}</span>
        }
      </div>
    );
  }

  render() {
    const isMobileOrTablet = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return isMobileOrTablet ? 
      null : 
      <ReactToolTip
        className="ToolTip"
        place="bottom"
        delayShow={700}
        effect="solid"
        getContent={this.getContent}
      />;
  }
}

export default ToolTip;