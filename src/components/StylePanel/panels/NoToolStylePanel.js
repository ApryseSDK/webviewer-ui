import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import DataElementWrapper from 'components/DataElementWrapper';
import DataElements from 'constants/dataElement';
import StylePanelHeader from '../StylePanelHeader/StylePanelHeader';

const NoToolStylePanel = () => {
  const [t] = useTranslation();
  return (
    <>
      <StylePanelHeader title={t('stylePanel.headings.styles')} />
      <DataElementWrapper dataElement={DataElements.StylePanel.NO_TOOL_SELECTED_CONTAINER} className="no-tool-selected">
        <DataElementWrapper dataElement={DataElements.StylePanel.NO_TOOL_SELECTED_ICON}>
          <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
        </DataElementWrapper>
        <DataElementWrapper dataElement={DataElements.StylePanel.NO_TOOL_SELECTED_MESSAGE} className="msg">{t('stylePanel.noToolSelected')}</DataElementWrapper>
      </DataElementWrapper>
    </>
  );
};

export default NoToolStylePanel;