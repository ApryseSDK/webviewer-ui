import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import classNames from 'classnames';
import TabOptions from '../TabOptionsButton';
import { useTranslation } from 'react-i18next';
import './SheetTab.scss';

const propTypes = {
  sheet: PropTypes.any.isRequired,
  sheetCount: PropTypes.number,
  activeSheetLabel: PropTypes.string.isRequired,
  setLabelBeingEdited: PropTypes.func.isRequired,
  setActiveSheet: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  validateName: PropTypes.func,
  noRightBorder: PropTypes.bool,
  isReadOnlyMode: PropTypes.bool,
};

const SheetTab = ({
  sheet,
  activeSheetLabel,
  onClick,
  sheetCount,
  setLabelBeingEdited,
  setActiveSheet,
  isEditMode,
  noRightBorder,
  validateName,
  isReadOnlyMode,
}) => {
  const { sheetIndex, name: label, disabled } = sheet;

  const isActive = label === activeSheetLabel;

  const [inputValue, setInputValue] = useState('');
  const [isInputError, setIsInputError] = useState(false);
  const { t } = useTranslation();
  const inputRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (inputValue && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue]);

  const onInputChange = (currentLabel, newLabel) => {
    const isDuplicate = validateName(currentLabel, newLabel);
    const isEmpty = newLabel.trim() === '';

    setIsInputError(isDuplicate || isEmpty);
    setInputValue(newLabel);
  };

  const updateActiveTab = (newActiveLabel, tabIndex) => {
    setLabelBeingEdited(null);
    setIsInputError(false);
    setActiveSheet(newActiveLabel, tabIndex);
  };

  const startLabelEditingMode = (text) => {
    setInputValue(text);
    setIsInputError(false);
    setLabelBeingEdited(text);
  };

  const inputErrorWarning = () => {
    const isEmpty = inputValue === '';
    const warningKey = isEmpty ? 'warning.sheetTabRenameIssueTwo' : 'warning.sheetTabRenameIssueOne';
    const warning = {
      message: t(`${warningKey}.message`),
      title: t(`${warningKey}.title`),
      confirmBtnText: t('action.ok'),
      onConfirm: () => inputRef.current.focus(),
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const onInputBlur = () => {
    if (isInputError) {
      inputErrorWarning();
      return;
    }
    setLabelBeingEdited(null);
    setIsInputError(false);
    setInputValue('');
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
      const warning = {
        message,
        title,
        confirmBtnText,
        secondaryBtnText,
        onConfirm: () => { },
        onSecondary: () => { },
      };
      dispatch(actions.showWarningMessage(warning));
    }
  };

  let component = null;
  if (isEditMode) {
    component = (
      <input type='text'
        className={classNames({ 'input-error': isInputError })}
        ref={inputRef}
        value={inputValue}
        onChange={(e) => onInputChange(label, e.target.value)}
        onBlur={onInputBlur}
        onKeyDown={onKeyDown}
      />
    );
  } else {
    component = (
      <>
        <Button
          role='tab'
          ariaControls={'document-container'}
          ariaSelected={isActive}
          ariaLabel={label}
          className={'sheet-label'}
          onClick={(e) => onClick(e, label, sheetIndex)}
          title={label}
          label={label}
          useI18String={false}
          disabled={disabled}
        />
        <div className='sheet-options'>
          <TabOptions id={label.replace(/\s+/g, '-').toLowerCase()}
            label={label}
            sheetCount={sheetCount}
            onToggle={(name) => updateActiveTab(name, sheetIndex)}
            handleClick={handleTabOptionSelection}
            disabled={isReadOnlyMode}
          />
        </div>
      </>
    );
  }

  return (<div className={classNames({
    'active': isActive,
    'no-left-border': noRightBorder,
    'disabled': disabled,
  }, 'sheet-tab')}
  >
    <div className={classNames({ 'input-mode': isEditMode },'tab-body')}>
      {component}
    </div>
  </div>);

};

SheetTab.propTypes = propTypes;

export default React.memo(SheetTab);