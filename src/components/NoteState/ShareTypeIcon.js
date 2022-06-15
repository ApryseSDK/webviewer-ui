// CUSTOM WISEFLOW
import React from 'react';
import PropTypes from 'prop-types';

import { ShareTypeColors } from 'constants/shareTypes';
import './ShareTypeIcon.scss';

function ShareTypeIcon(props) {
  const shareTypeColor = ShareTypeColors[props.shareType];
  return (
    <div className="share-type-icon" aria-label={props.ariaLabel}>
      <div className="share-type-icon-inner" style={{ backgroundColor: shareTypeColor }} />
    </div>
  );
}

PropTypes.ShareTypeIcon = {
  shareType: PropTypes.string, // in ["ASSESSORS", "PARTICIPANTS", "ALL", "NONE"]
};

export default ShareTypeIcon;
