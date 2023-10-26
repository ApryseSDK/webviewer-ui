import React from 'react';
import selectors from 'selectors';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './ZoomText.scss';

export default function ZoomText() {
  const currentZoom = useSelector(selectors.getZoom);
  const { t } = useTranslation();

  return (
    <div className="ZoomText">
      <div className="label">{t('action.zoom')}:</div>
      &nbsp;
      <div className="value">{Math.ceil(currentZoom * 100)}%</div>
    </div>
  );
}
