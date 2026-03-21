import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import DataElements from 'constants/dataElement';

const propTypes = {
  tabs: PropTypes.array,
  activeTabKey: PropTypes.string,
  onTabClick: PropTypes.func.isRequired,
};

const InlineCommentingOfficeEditorTabs = ({
  tabs = [],
  activeTabKey = null,
  onTabClick,
}) => {
  const [t] = useTranslation();
  const showTabs = tabs.length > 1;

  if (!showTabs) {
    return null;
  }

  return (
    <div className='inline-comment-tabs' data-element={DataElements.INLINE_COMMENT_POPUP_TABS}>
      <div className='tab-list' role='tablist' aria-label={t('officeEditor.commentsAndChangesTabs')}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type='button'
            className={classNames('tab-options-button', { selected: tab.key === activeTabKey })}
            data-element={tab.dataElement}
            role='tab'
            aria-selected={tab.key === activeTabKey}
            onClick={() => onTabClick(tab)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
};

InlineCommentingOfficeEditorTabs.propTypes = propTypes;

export default InlineCommentingOfficeEditorTabs;
