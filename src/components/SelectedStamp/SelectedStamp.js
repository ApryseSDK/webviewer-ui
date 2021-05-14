import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import core from 'core';

import './SelectedStamp.scss';

const SelectedStamp = ({ tReady, toolName }) => {
  const [t] = useTranslation();
  useEffect(() => {
    const selectedStamp = core.getTool(toolName);
    core.setToolMode(toolName);
    selectedStamp.showPreview();
  }, [toolName]);

  return (
    <div
      className="stamp-overlay"
    >
      <div className="no-presets">
        {tReady? t('message.toolsOverlayNoPresets') : ''}
      </div>
    </div>
  );
};

export default SelectedStamp;