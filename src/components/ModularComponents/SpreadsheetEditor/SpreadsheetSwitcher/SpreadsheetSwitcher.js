import React, { useState, useMemo, useRef } from 'react';
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
  const breakpoint = useMemo(() => Math.floor((width - 80) / 170), [width]);
  const { t } = useTranslation();
  const [labelBeingEdited, setLabelBeingEdited] = useState('');

  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const isReadOnlyMode = spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;

  const updateActiveTab = (newActiveLabel, tabIndex) => {
    setLabelBeingEdited(null);
    setActiveSheet(newActiveLabel, tabIndex);
  };

  const handleTabNameClick = (e, label, index) => {
    e.preventDefault();
    e.stopPropagation();
    updateActiveTab(label, index);
  };

  // Break the sheet tabs into two, one regular view, and one into flyout
  const [slicedTabs, flyoutTabs] = useMemo(() => {
    return [tabs.slice(0, breakpoint), tabs.slice(breakpoint)];
  }, [tabs, breakpoint]);

  const tabListRef = useRef();
  const {
    currentFocusIndex,
  } = useTabKeyboardNavigation(tabListRef, [slicedTabs, labelBeingEdited]);

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
      noRightBorder={tabs[item.sheetIndex + 1] && tabs[item.sheetIndex + 1].name === activeSheetLabel}
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
              tabsForReference={tabs}
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