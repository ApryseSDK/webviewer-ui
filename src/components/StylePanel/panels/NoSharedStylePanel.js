import React from 'react';
import PropTypes from 'prop-types';
import useStylePanel from 'hooks/useStylePanel';
import Icon from 'src/components/Icon';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from 'components/DataElementWrapper';
import DataElements from 'constants/dataElement';
import StylePanelHeader from '../StylePanelHeader/StylePanelHeader';

const NoSharedStylePanel = ({ currentTool, selectedAnnotations }) => {
  const [t] = useTranslation();

  const {
    panelTitle,
  } = useStylePanel({ currentTool, selectedAnnotations });

  return (
    <>
      <StylePanelHeader title={panelTitle} />
      <DataElementWrapper dataElement={DataElements.StylePanel.NO_SHARED_STYLE_CONTAINER} className="no-tool-selected">
        <DataElementWrapper dataElement={DataElements.StylePanel.NO_SHARED_STYLE_ICON}>
          <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
        </DataElementWrapper>
        <DataElementWrapper dataElement={DataElements.StylePanel.NO_SHARED_STYLE_MESSAGE} className="msg">{t('stylePanel.noSharedToolStyle')}</DataElementWrapper>
      </DataElementWrapper>
    </>
  );
};

NoSharedStylePanel.propTypes = {
  selectedAnnotations: PropTypes.arrayOf(PropTypes.object),
  currentTool: PropTypes.object,
};

export default NoSharedStylePanel;