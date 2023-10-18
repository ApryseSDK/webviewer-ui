import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';

const StylePanel = () => {
  const [t] = useTranslation();

  const noToolSelected = (
    <div className="no-tool-selected">
      <div>
        <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
      </div>
      <div className="msg">{t('stylePanel.noToolSelected')}</div>
    </div>
  );

  return (
    <>
      <div className='style-panel-header'>
        {t('stylePanel.headings.styles')}
      </div>
      {noToolSelected}
    </>
  );
};

export default StylePanel;