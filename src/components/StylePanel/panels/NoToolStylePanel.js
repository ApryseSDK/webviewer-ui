import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';

const NoToolStylePanel = () => {
  const [t] = useTranslation();
  return (
    <>
      <h2 className="style-panel-header">{t('stylePanel.headings.styles')}</h2>
      <div className="no-tool-selected">
        <div>
          <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
        </div>
        <div className="msg">{t('stylePanel.noToolSelected')}</div>
      </div>
    </>
  );
};

export default NoToolStylePanel;