import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import DataElementWrapper from '../DataElementWrapper';
import { v4 as uuidv4 } from 'uuid';
import './Wv3dPropertiesPanel.scss';

import PropertiesElement from './PropertiesElement/PropertiesElement';

const Wv3dPropertiesPanel = (props) => {
  const { currentWidth, isInDesktopOnlyMode, isMobile = false, closeWv3dPropertiesPanel, schema, modelData } = props;

  const { t } = useTranslation();
  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };

  const renderMobileCloseButton = () => {
    return (
      <div className="close-container">
        <div className="close-icon-container" onClick={closeWv3dPropertiesPanel}>
          <Icon glyph="ic_close_black_24px" className="close-icon" />
        </div>
      </div>
    );
  };

  let propertiesCollection = modelData.map((element) => (
    <PropertiesElement key={`${element.handle}-${uuidv4()}`} element={element} schema={schema} />
  ));

  const emptyPanelPlaceholder = () => {
    return (
      <div className="no-selections">
        <div>
          <Icon className="empty-icon" glyph="ic-wv3d-properties-panel-menu" />
        </div>
        <div className="empty-text">{t('wv3dPropertiesPanel.emptyPanelMessage')}</div>
      </div>
    );
  };

  if (modelData.length < 1) {
    propertiesCollection = emptyPanelPlaceholder();
  }

  return (
    <DataElementWrapper dataElement="wv3dPropertiesPanel" className="Panel wv3d-properties-panel" style={style}>
      {!isInDesktopOnlyMode && isMobile && renderMobileCloseButton()}
      {propertiesCollection}
    </DataElementWrapper>
  );
};

export default Wv3dPropertiesPanel;
