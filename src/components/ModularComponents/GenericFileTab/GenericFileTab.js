import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import useWindowDimensions from 'helpers/useWindowsDimensions';
import './GenericFileTab.scss';
import classNames from 'classnames';
import Button from 'components/Button';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import { useTranslation } from 'react-i18next';
import DataElements from 'src/constants/dataElement';
import AdditionalTabsFlyout from './AdditionalTabsFlyout';
import TabOptions from './TabOptionsButton';
import Icon from 'src/components/Icon';


const GenericFileTab = (/* props */) => {
  const [active, setActive] = useState('Sheet 1');
  const [tabs, setTabs] = useState([
    { name: 'Sheet 1', disabled: false },
    { name: 'Sheet 2', disabled: false },
    { name: 'Sheet 3', disabled: true },
  ]);
  const { width } = useWindowDimensions();
  const breakpoint = Math.floor((width - 80) / 170);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [labelBeingEdited, setLabelBeingEdited] = useState(null);
  const [editedLabel, setEditedLabel] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isInputError, setIsInputError] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
    if (inputValue) {
      inputRef.current.focus();
    }
  }, [inputValue]);

  const updateActiveTab = (newActiveLabel) => {
    setLabelBeingEdited(null);
    setIsInputError(false);
    setActive(newActiveLabel);
  };

  const startLabelEditingMode = (text) => {
    setInputValue(text);
    setIsInputError(false);
    setLabelBeingEdited(text);
  };

  const onInputChange = (currentLabel, newLabel) => {
    const indexOfNameBeingEdited = tabs.map((e) => e.name).indexOf(currentLabel);
    const newTabs = tabs.concat();
    newTabs.splice(indexOfNameBeingEdited, 1);
    if (newTabs.map((e) => e.name).includes(newLabel) || newLabel === '') {
      setIsInputError(true);
    } else {
      setIsInputError(false);
    }
    setInputValue(newLabel);
  };

  const onInputBlur = () => {
    if (isInputError) {
      let message = t('warning.sheetTabRenameIssueOne.message');
      let title = t('warning.sheetTabRenameIssueOne.title');
      const confirmBtnText = t('action.ok');
      if (inputValue === '') {
        message = t('warning.sheetTabRenameIssueTwo.message');
        title = t('warning.sheetTabRenameIssueTwo.title');
      }
      let warning = {
        message,
        title,
        confirmBtnText,
        onConfirm: () => {
          inputRef.current.focus();
        },
      };
      dispatch(actions.showWarningMessage(warning));
      return;
    }
    setLabelBeingEdited(null);
    setIsInputError(false);

    const newTabs = tabs.concat();
    const indexOf = newTabs.map((e) => e.name).indexOf(editedLabel);
    newTabs[indexOf] = { name: inputValue };
    setTabs(newTabs);
    setActive(inputValue);
    setInputValue('');
    setEditedLabel(null);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !isInputError) {
      onInputBlur();
    }
  };

  const handleTabOptionSelection = (id, sheetName, option) => {
    if (option === 'Rename') {
      startLabelEditingMode(sheetName);
    } else if (option === 'Delete') {
      const message = t('warning.sheetTabDeleteMessage.message');
      const title = t('warning.sheetTabDeleteMessage.title');
      const confirmBtnText = t('action.ok');
      const secondaryBtnText = t('action.cancel');
      let warning = {
        message,
        title,
        confirmBtnText,
        secondaryBtnText,
        onConfirm: () => {

          const newTabs = tabs.concat();
          let index = newTabs.indexOf(sheetName);
          newTabs.splice(index, 1);
          setTabs(newTabs);
          let activeLabel = newTabs[0];
          if (index > 2) {
            activeLabel = newTabs[index--];
          } else if (index === 0 && newTabs.length > 2) {
            activeLabel = newTabs[index++];
          }
          setActive(activeLabel);
        },
        onSecondary: () => { },
      };
      dispatch(actions.showWarningMessage(warning));
    }
  };

  const handleTabNameDoubleClick = (e, label) => {
    e.preventDefault();
    e.stopPropagation();
    startLabelEditingMode(label);
    setEditedLabel(label);
  };

  const handleTabNameClick = (e, label) => {
    e.preventDefault();
    e.stopPropagation();
    updateActiveTab(label);
  };

  const handleAddSheetButton = () => {
    const newTabs = tabs.concat();
    let i = 1;
    let newLabel = `Sheet ${newTabs.length + i}`;
    let index = newTabs.map((e) => e.name).indexOf(newLabel);

    // Sheet names contain integers, and we aim to find unique
    // integers to prevent duplicates across sheets.
    while (index !== -1) {
      i++;
      newLabel = `Sheet ${newTabs.length + i}`;
      index = newTabs.map((e) => e.name).indexOf(newLabel);
    }

    newTabs.push({ name: newLabel });
    setTabs(newTabs);
    // Make new sheet active
    setActive(newLabel);
  };

  // Break the sheet tabs into two, one regular view, and one into flyout
  const slicedTabs = tabs.slice(0, breakpoint);
  const remainingTabs = tabs.slice(breakpoint);

  const tabElements = slicedTabs.map((item, i) => {
    const label = item.name;
    let noRightBorder = false;
    if (tabs[i + 1] && tabs[i + 1].name === active) {
      noRightBorder = true;
    }

    if (labelBeingEdited === label) {
      return (
        <div className={classNames({
          'active': label === active,
          'no-left-border': noRightBorder,
        }, 'sheet-tab')} key={label} >
          <div className='tab-body input-mode'>
            <input type='text'
              className={classNames({ 'input-error': isInputError })}
              ref={inputRef}
              value={inputValue}
              onChange={(e) => onInputChange(inputValue, e.target.value)}
              onBlur={onInputBlur}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={classNames({
        'active': label === active,
        'no-left-border': noRightBorder,
        'disabled': item.disabled,
      }, 'sheet-tab')}
      key={label + i}
      role='button'
      onClick={(e) => handleTabNameClick(e, label)}>
        <div className='tab-body'>
          <Button
            role='tab'
            ariaControls={'document-container'}
            ariaSelected={false}
            ariaLabel={label}
            className={'sheet-label'}
            onClick={(e) => handleTabNameClick(e, label)}
            onDoubleClick={(e) => handleTabNameDoubleClick(e, label)}
            title={label}
            label={label}
            useI18String={false}
            disabled={item.disabled}
          />
          <div className='sheet-options'>
            <TabOptions id={label.replace(/\s+/g, '-').toLowerCase()}
              label={label}
              tabs={tabs}
              onToggle={updateActiveTab}
              handleClick={handleTabOptionSelection}
              disabled={item.disabled}
            />
          </div>
        </div>
      </div>
    );
  });

  const isActiveInRemainingTabs = remainingTabs.some((item) => item.name === active);

  return (
    <div className={'GenericFileTab'}>
      {tabElements}
      {
        (remainingTabs && remainingTabs.length)
          ? (
            <ToggleElementButton
              className='dropdown-menu tab-dropdown-button'
              dataElement='tabTrigger'
              title={t('message.showMore')}
              toggleElement={DataElements.ADDITIONAL_SHEET_TABS_MENU}
              label={remainingTabs.length.toString()}
            >
              {(isActiveInRemainingTabs) && (<Icon glyph="icon-active-indicator"></Icon>)}
            </ToggleElementButton>
          )
          : null
      }
      <Button
        className='add-sheet-tab'
        title='action.addSheet'
        img='icon-menu-add'
        onClick={handleAddSheetButton}
        dataElement={'addTabButton'}
        tabIndex={-1}
        label={''}
      />
      {remainingTabs?.length > 0 &&
        (
          <AdditionalTabsFlyout
            id={DataElements.ADDITIONAL_SHEET_TABS_MENU}
            additionalTabs={remainingTabs}
            tabsForReference={tabs}
            onClick={updateActiveTab}
            activeItem={active}

          />
        )
      }
    </div>
  );
};

GenericFileTab.propTypes = {
};

export default GenericFileTab;
