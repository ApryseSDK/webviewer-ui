import React, { useState } from 'react';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import './CollapsiblePanelGroup.scss';

const CollapsiblePanelGroup = (props) => {
  const {
    header,
    children,
    className,
    role,
    style,
  } = props;

  const [isExpanded, setIsExpanded] = useState(true);
  const { t } = useTranslation();

  return (
    <div className={className} role={role} style={style}>
      <div className="collapsible-page-group-header">
        {header()}
        <Button
          title={isExpanded ? t('redactionPanel.collapse') : t('redactionPanel.expand')}
          img={isExpanded ? 'icon-chevron-up' : 'icon-chevron-down'}
          className="expand-arrow"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>
      {isExpanded && children}
    </div>
  );
};

export default CollapsiblePanelGroup;