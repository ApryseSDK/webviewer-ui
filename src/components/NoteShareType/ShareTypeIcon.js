// CUSTOM WISEFLOW
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import ShareTypes, { ShareTypeColors } from 'constants/shareTypes';
import './ShareTypeIcon.scss';
import Tooltip from '../Tooltip';

const propTypes = {
  shareType: PropTypes.string, // in ["ASSESSORS", "PARTICIPANTS", "ALL", "NONE"]
  label: PropTypes.string.isRequired,
};

function ShareTypeIcon(props) {
  const { shareType, label } = props;
  const { backgroundColor, borderColor } = shareType
    ? ShareTypeColors[shareType]
    : {
        backgroundColor: 'transparent',
        borderColor: '#9e9e9e',
      };
  const iconRef = useRef();

  return (
    <Tooltip ref={iconRef} translatedContent={label} hideOnClick>
      <div
        ref={iconRef}
        className="share-type-icon"
        aria-label={label}
        style={{
          '--background-color': backgroundColor,
          '--border-color': borderColor,
        }}
      >
        <div className="wf-label-legend" />
      </div>
    </Tooltip>
  );
}

PropTypes.ShareTypeIcon = propTypes;

export default ShareTypeIcon;
