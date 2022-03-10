import React from 'react';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from '../DataElementWrapper';
import './RedactionSearchOverlay.scss'
const RedactionSearchOverlay = (props) => {

  const { t } = useTranslation();
  return (
    <DataElementWrapper
      className="RedactionSearchOverlay"
      dataElement="redactionSearchOverlay"
    >
      <input
        type="text"
        placeholder={t('redactionPanel.redactionSearchPlaceholder')}
      />
    </DataElementWrapper>

  )
};

export default RedactionSearchOverlay;