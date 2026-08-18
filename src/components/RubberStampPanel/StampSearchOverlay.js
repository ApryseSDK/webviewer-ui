import React from 'react';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import Icon from 'components/Icon';
import ToggleElementButton from 'components/ToggleElementButton';
import './StampSearchOverlay.scss';

const StampSearchOverlay = () => {
  const [t] = useTranslation();

  return (
    <div className="StampSearchOverlay">
      <div className="search-input-row">
        <div className='input-container'>
          <Icon glyph="icon-header-search" />
          <input
            className='search-panel-input'
            type="text"
            autoComplete="off"
            aria-label={t('message.searchDocumentPlaceholder')}
          />
        </div>
        <div className="search-option-buttons">
          <ToggleElementButton
            dataElement="searchOptionsButton"
            title={t('option.searchPanel.filter')}
            ariaLabel={t('option.searchPanel.filter')}
            img={'ic-filter-alt'}
            className={'search-options-button'}
            toggleElement={DataElements.SEARCH_OPTIONS_FLYOUT}
          />
        </div>
      </div>
    </div>
  );
};

export default StampSearchOverlay;
