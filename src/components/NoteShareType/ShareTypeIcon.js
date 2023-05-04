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
  const shareTypeColor = shareType ? ShareTypeColors[shareType] : undefined;
  const empty = !shareTypeColor;
  const iconRef = useRef();
  return (
    <Tooltip ref={iconRef} translatedContent={label} showOnKeyboardFocus hideOnClick>
      <div ref={iconRef} className="share-type-icon" aria-label={label}>
        <div className="share-type-icon-inner" style={{ background: empty ? 'transparent' : shareTypeColor, border: empty ? `2px solid ${ShareTypeColors[ShareTypes.NONE]}` : undefined }} />
      </div>
    </Tooltip>
  );
}

PropTypes.ShareTypeIcon = propTypes;

export default ShareTypeIcon;
