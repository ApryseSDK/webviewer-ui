import React from 'react';
import PropTypes from 'prop-types';
import useStylePanel from 'hooks/useStylePanel';
import Icon from 'src/components/Icon';
import { useTranslation } from 'react-i18next';

const NoSharedStylePanel = ({ currentTool, selectedAnnotations }) => {
  const [t] = useTranslation();

  const {
    panelTitle,
  } = useStylePanel({ currentTool, selectedAnnotations });

  return (
    <>
      {panelTitle && (
        <h2 className="style-panel-header">{panelTitle}</h2>
      )}
      <div className="no-tool-selected">
        <div>
          <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
        </div>
        <div className="msg">{t('stylePanel.noSharedToolStyle')}</div>
      </div>
    </>
  );
};

NoSharedStylePanel.propTypes = {
  selectedAnnotations: PropTypes.arrayOf(PropTypes.object),
  currentTool: PropTypes.object,
};

export default NoSharedStylePanel;