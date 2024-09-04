import React from 'react';
import PropTypes from 'prop-types';
import RedactionItem from './RedactionItem';
import CollapsibleSection from 'components/CollapsibleSection';
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
      `${t('option.shared.page')} ${pageNumber}`
    );
  };

  return (
    <CollapsibleSection
      className="redaction-page-group"
      header={header}
      expansionDescription={`${t('option.shared.page')} ${pageNumber} ${t('redactionPanel.redactionItems')}`}
      headingLevel={2}
    >
      <div role="list" className="redaction-items">
        {redactionItems.map((redactionItem) => (
          <RedactionItem
            annotation={redactionItem}
            key={`${redactionItem.Id}-${pageNumber}`}
          />
        ))}
      </div>
    </CollapsibleSection>
  );
};

RedactionPageGroup.propTypes = {
  pageNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  redactionItems: PropTypes.array,
};

export default RedactionPageGroup;