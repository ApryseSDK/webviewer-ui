import React from 'react';
import RedactionItem from './RedactionItem';
import CollapsiblePanelGroup from 'components/CollapsiblePanelGroup';
import { useTranslation } from 'react-i18next';

import './RedactionPageGroup.scss';

const RedactionPageGroup = (props) => {
  const {
    pageNumber,
    redactionItems,
  } = props;

  const { t } = useTranslation();

  const header = () => {
    return (
      <div className="redaction-page-group-number">
        {t('option.shared.page')} {pageNumber}
      </div>
    );
  };

  return (
    <CollapsiblePanelGroup
      className="redaction-page-group"
      header={header}
    >
      <div role="list" className="redaction-items">
        {redactionItems.map((redactionItem) => (
          <RedactionItem
            annotation={redactionItem}
            key={`${redactionItem.Id}-${pageNumber}`}
          />
        ))}
      </div>
    </CollapsiblePanelGroup>
  );
};

export default RedactionPageGroup;