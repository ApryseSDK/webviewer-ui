import React, { useRef, useState } from 'react';
import StampSearchOptionsFlyout from 'components/ModularComponents/StampSearchOptionsFlyout';
import { useTranslation } from 'react-i18next';
import DataElements from 'constants/dataElement';
import Icon from 'components/Icon';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import Button from 'components/Button';
import './StampSearchOverlay.scss';
import PropTypes from 'prop-types';

const StampSearchOverlay = ({
  categoryMap,
  onCategoryCheckboxChange,
  isPanelOpen,
  isFlyout,
  searchValue,
  setSearchValue,
}) => {
  const [t] = useTranslation();
  const [isSearchOptionsOpen, setIsSearchOptionsOpen] = useState(false);
  const searchOptionsTriggerRef = useRef(null);
  const isSearchOptionsDisabled = Object.keys(categoryMap).length === 0;

  return (
    <div className="StampSearchOverlay">
      <div className="search-input-row">
        <div className='input-container'>
          <Icon glyph="icon-header-search" />
          <input
            className='search-panel-input'
            type="text"
            autoComplete="off"
            aria-label={t('rubberStampPanel.searchStamps')}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
        <div ref={searchOptionsTriggerRef} className="search-option-buttons">
          {isFlyout ? (
            <Button
              dataElement="stampSearchOptionsButton"
              title={t('rubberStampPanel.filter')}
              ariaLabel={t('rubberStampPanel.filter')}
              ariaControls="stampSearchOptionsFlyout"
              ariaExpanded={isSearchOptionsOpen}
              img="ic-filter-alt"
              disabled={isSearchOptionsDisabled}
              className="search-options-button"
              onClick={() => {
                if (!isSearchOptionsDisabled) {
                  setIsSearchOptionsOpen((isOpen) => !isOpen);
                }
              }}
            />
          ) : (
            <ToggleElementButton
              dataElement="stampSearchOptionsButton"
              title={t('rubberStampPanel.filter')}
              ariaLabel={t('rubberStampPanel.filter')}
              img="ic-filter-alt"
              disabled={isSearchOptionsDisabled}
              className="search-options-button"
              toggleElement={DataElements.STAMP_SEARCH_OPTIONS_FLYOUT}
            />
          )}
          <StampSearchOptionsFlyout
            isPanelOpen={isPanelOpen ?? false}
            isNestedFlyout={isFlyout}
            isOpen={isSearchOptionsOpen}
            onClose={() => setIsSearchOptionsOpen(false)}
            triggerRef={searchOptionsTriggerRef}
            categoryMap={categoryMap}
            onCategoryCheckboxChange={onCategoryCheckboxChange}
          />
        </div>
      </div>
    </div>
  );
};

StampSearchOverlay.propTypes = {
  categoryMap: PropTypes.object.isRequired,
  onCategoryCheckboxChange: PropTypes.func,
  isPanelOpen: PropTypes.bool,
  isFlyout: PropTypes.bool,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func,
};

export default StampSearchOverlay;
