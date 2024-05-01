import React from 'react';
import { useTranslation } from 'react-i18next';
import './HeaderTitle.scss';

const HeaderTitle = (attributes) => {
  const { title } = attributes;
  const { t } = useTranslation();

  return (
    <h1 data-element="headerTitle" className="header-title">
      <span>{t('wv3dPropertiesPanel.propertiesHeader')}</span>
      <span> </span>
      <span className="header-value">{title}</span>
    </h1>
  );
};

export default HeaderTitle;
