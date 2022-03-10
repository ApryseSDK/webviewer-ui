import React, { useState } from 'react';
import RedactionItem from './RedactionItem';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';

import './RedactionPageGroup.scss'
const RedactionPageGroup = (props) => {
  const {
    pageNumber,
    redactionItems,
  } = props;

  const [isExpanded, setIsExpanded] = useState(true);

  const { t } = useTranslation();

  return (
    <div className="redaction-page-group">
      <div className="redaction-page-group-header">
        <div className="redaction-page-group-number">
          {t('option.shared.page')} {pageNumber}
        </div>
        <Button
          title={isExpanded ? t('redactionPanel.collapse') : t('redactionPanel.expand')}
          img={isExpanded ? "icon-chevron-up" : "icon-chevron-down"}
          className="expand-arrow"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      {isExpanded && (
        <div role="list" className="redaction-items">
          {redactionItems.map(redactionItem => (
            <RedactionItem
              annotation={redactionItem}
              key={`${redactionItem.Id}-${pageNumber}`}
            />
          ))}
        </div>
      )}
    </div>
  )
};

export default RedactionPageGroup;