import React from 'react';

import './HorizontalDivider.scss';

const HorizontalDivider = ({ style = {} }) => {
  return (
    <div
      className="divider-container"
      style={style}
    >
      <div className="divider-horizontal" />
    </div>
  );
};

export default HorizontalDivider;