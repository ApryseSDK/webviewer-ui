import React from 'react';
import { css } from '@emotion/react';
import './HorizontalDivider.scss';

const HorizontalDivider = ({ style = {} }) => {
  return (
    <div
      className="divider-container"
      css={css({
        ...style
      })}
    >
      <div className="divider-horizontal" />
    </div>
  );
};

export default HorizontalDivider;