import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from '../DataElementWrapper';
import DataElements from 'constants/dataElement';

import './WatermarkPanel.scss';
import TextWatermarkPanel from './TextWatermarkPanel';
import ImageWatermarkPanel from './ImageWatermarkPanel';

const tabs = [
  {
    type: 'text',
    text: 'textWatermark',
    dataElement: DataElements.WATERMARK_PANEL_TEXT_TAB,
  },
  {
    type: 'image',
    text: 'uploadImage',
    dataElement: DataElements.WATERMARK_PANEL_IMAGE_TAB,
  }
];

const WatermarkPanelHeader = (props) => {
  const {
    activeWatermarkType,
    setActiveWatermarkType
  } = props;

  const { t } = useTranslation();

  return (
    <>
      <div className="watermark-panel-tabs">
        { tabs.map((tab) => (
          <DataElementWrapper
            dataElement={tab.dataElement} key={tab.type}
            className={`watermark-panel-tab ${activeWatermarkType === tab.type ? 'active' : ''}`}
            onClick={() => {
              setActiveWatermarkType(tab.type);
            }}
          >
            {t(`watermarkPanel.${tab.text}`)}
          </DataElementWrapper>
        ))}
      </div>
    </>
  );
};

const WatermarkPanel = () => {
  const [activeWatermarkType, setActiveWatermarkType] = useState(tabs[0].type);
  const { t } = useTranslation();

  return (
    <>
      <span className="watermark-panel-header">{t('watermarkPanel.watermarkOptions')}</span>
      <WatermarkPanelHeader
        activeWatermarkType={activeWatermarkType}
        setActiveWatermarkType={setActiveWatermarkType}
      />
      { activeWatermarkType === 'text' && <TextWatermarkPanel/>}
      { activeWatermarkType === 'image' && <ImageWatermarkPanel/>}
    </>
  );
};

export default WatermarkPanel;