import React from 'react';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';

const WatermarkList = (props) => {
  const {
    watermarks = [],
    // deleteWatermark,
  } = props;

  const { t } = useTranslation();

  return (
    <>
      <span className="watermark-panel-sub-header">{t('watermarkPanel.watermarks')}</span>
      { watermarks.map((watermark) => (
        <div className="watermark-file" key={watermark.name}>
          { watermark.type === 'image' && <Icon glyph="icon-image-green" />}
          { watermark.name }
          <Icon glyph="ic-close" />
          {}
        </div>
      ))}
    </>
  );
};

export default WatermarkList;