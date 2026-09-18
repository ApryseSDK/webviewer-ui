import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useWindowDimensions from 'helpers/useWindowsDimensions';
import Button from 'components/Button';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import Icon from 'components/Icon';
import DataElements from 'constants/dataElement';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';
import AdditionalTabsFlyout from './AdditionalTabsFlyout';
import SheetTab from './SheetTab/SheetTab';
import './SpreadsheetSwitcher.scss';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import useTabKeyboardNavigation from 'hooks/useArrowNavigation';

const isEditableElement = (target) => {
  if (
    !target ||
    !(target instanceof HTMLElement)
  ) {
    return false;
  }

  const tagName = target.tagName;
  const role = target.getAttribute('role');

  return target.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT' ||
    role === 'textbox';
};

const SpreadsheetSwitcher = (props) => {
  const {
    tabs = [],
    activeSheetIndex = 0,
    setActiveSheet,
    createNewSheet,
    deleteSheet,
    renameSheet,
    checkIsSheetNameDuplicated,
    skipDeleteWarning = false,
  } = props;
  const activeSheetLabel = tabs.find((tab) => tab.sheetIndex === activeSheetIndex)?.name || '';
  const { width } = useWindowDimensions();
  const visibleTabCount = useMemo(() => Math.max(1, Math.floor((width - 80) / 170)), [width]);
  const { t } = useTranslation();
  const [labelBeingEdited, setLabelBeingEdited] = useState('');

  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const isReadOnlyMode = spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;

  const updateActiveTab = useCallback((newActiveLabel, tabIndex) => {
    setLabelBeingEdited(null);
    setActiveSheet(newActiveLabel, tabIndex);
  }, [setActiveSheet]);

  const handleTabNameClick = (e, label, index) => {
    e.preventDefault();
    e.stopPropagation();
    updateActiveTab(label, index);
  };

  const displayTabs = useMemo(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.sheetIndex === activeSheetIndex);
    if (activeTabIndex < visibleTabCount) {
      return tabs;
    }

    const reorderedTabs = [...tabs];
    const [activeTab] = reorderedTabs.splice(activeTabIndex, 1);
    reorderedTabs.splice(visibleTabCount - 1, 0, activeTab);

    return reorderedTabs;
  }, [tabs, activeSheetIndex, visibleTabCount]);

  // Break the sheet tabs into two, one regular view, and one into flyout
  const [slicedTabs, flyoutTabs] = useMemo(() => {
    return [displayTabs.slice(0, visibleTabCount), displayTabs.slice(visibleTabCount)];
  }, [displayTabs, visibleTabCount]);

  const shouldIgnoreKeydown = useCallback((e) => isEditableElement(e.target), []);

  const tabListRef = useRef();
  const {
    currentFocusIndex,
  } = useTabKeyboardNavigation(tabListRef, [slicedTabs, labelBeingEdited], {
    shouldIgnoreKeydown,
  });

  const tabElements = slicedTabs.map((item, i) => (
    <SheetTab
      key={item.sheetIndex}
      sheet={item}
      sheetCount={tabs.length}
      activeSheetLabel={activeSheetLabel}
      onClick={handleTabNameClick}
      isEditMode={labelBeingEdited === item.name}
      setLabelBeingEdited={setLabelBeingEdited}
      setActiveSheet={setActiveSheet}
      deleteSheet={deleteSheet}
      renameSheet={renameSheet}
      noRightBorder={slicedTabs[i + 1]?.name === activeSheetLabel}
      checkIsSheetNameDuplicated={checkIsSheetNameDuplicated}
      isReadOnlyMode={isReadOnlyMode}
      skipDeleteWarning={skipDeleteWarning}
      tabIndex={currentFocusIndex === i ? 0 : -1}
    />
  ));

  const isActiveSheetInFlyout = useMemo(() => {
    return flyoutTabs.some((item) => item.name === activeSheetLabel);
  }, [flyoutTabs, activeSheetLabel]);

  return (
    <div className="SpreadsheetSwitcher ModularHeader BottomHeader stroke start">
      <div className={'GenericFileTab'} role='tablist' ref={tabListRef}>
        {tabElements}
        {
          (flyoutTabs?.length > 0) ?
            (
              <ToggleElementButton
                className="dropdown-menu tab-dropdown-button"
                dataElement="tabTrigger"
                title={t('message.showMore')}
                toggleElement={DataElements.ADDITIONAL_SPREADSHEET_TABS_MENU}
                label={flyoutTabs.length.toString()}
              >
                {(isActiveSheetInFlyout) && (<Icon glyph="icon-active-indicator"></Icon>)}
              </ToggleElementButton>
            ) : null
        }
        <Button
          className="add-sheet-tab"
          title="action.addSheet"
          img="icon-menu-add"
          onClick={createNewSheet}
          dataElement={'addTabButton'}
          label={''}
          ariaLabel={t('action.addSheet')}
          disabled={isReadOnlyMode}
        />
        {flyoutTabs?.length > 0 &&
          (
            <AdditionalTabsFlyout
              id={DataElements.ADDITIONAL_SPREADSHEET_TABS_MENU}
              additionalTabs={flyoutTabs}
              onClick={updateActiveTab}
              activeItem={activeSheetLabel}
            />
          )
        }
      </div>
    </div>
  );
};

SpreadsheetSwitcher.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    sheetIndex: PropTypes.number,
    disabled: PropTypes.bool,
  })),
  activeSheetIndex: PropTypes.number,
  setActiveSheet: PropTypes.func,
  createNewSheet: PropTypes.func,
  deleteSheet: PropTypes.func,
  renameSheet: PropTypes.func,
  skipDeleteWarning: PropTypes.bool,
  checkIsSheetNameDuplicated: PropTypes.func,
};

export default SpreadsheetSwitcher;