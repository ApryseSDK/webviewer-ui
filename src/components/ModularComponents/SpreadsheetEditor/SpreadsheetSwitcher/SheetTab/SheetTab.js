import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import classNames from 'classnames';
import TabOptions from '../TabOptionsButton';
import { useTranslation } from 'react-i18next';
import './SheetTab.scss';
import useFocusOnClose from 'hooks/useFocusOnClose';

const propTypes = {
  sheet: PropTypes.any.isRequired,
  sheetCount: PropTypes.number,
  activeSheetLabel: PropTypes.string.isRequired,
  setLabelBeingEdited: PropTypes.func.isRequired,
  setActiveSheet: PropTypes.func.isRequired,
  renameSheet: PropTypes.func.isRequired,
  deleteSheet: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  checkIsSheetNameDuplicated: PropTypes.func,
  noRightBorder: PropTypes.bool,
  isReadOnlyMode: PropTypes.bool,
  skipDeleteWarning: PropTypes.bool,
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
  checkIsSheetNameDuplicated,
  isReadOnlyMode,
  deleteSheet,
  renameSheet,
  skipDeleteWarning,
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

  const onInputChange = (e) => {
    const newLabel = e.target.value;
    const isDuplicate = checkIsSheetNameDuplicated(newLabel);
    setIsInputError(isDuplicate);
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
      onCancel: () => {
        setLabelBeingEdited(false);
        setIsInputError(false);
        setInputValue(label);
      }
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const onInputBlur = () => {
    if (isInputError) {
      inputErrorWarning();
      return;
    }
    const isInputValueDuplicated = checkIsSheetNameDuplicated(inputValue);
    const isEmpty = inputValue.trim() === '';

    if (isInputValueDuplicated || isEmpty) {
      setIsInputError(true);
      inputErrorWarning();
      return;
    }

    renameSheet(label, inputValue);
    setLabelBeingEdited(null);
    setIsInputError(false);
    setInputValue('');
  };

  const handleInputBlurWithFocusTransfer = useFocusOnClose(onInputBlur, 'addTabButton');

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !isInputError) {
      handleInputBlurWithFocusTransfer();
    }
  };

  const handleTabOptionSelection = (id, sheetName, option) => {
    if (option === 'Rename') {
      startLabelEditingMode(sheetName);
    } else if (option === 'Delete') {
      if (skipDeleteWarning) {
        return deleteSheet(label);
      }
      const message = t('warning.sheetTabDeleteMessage.message');
      const title = t('warning.sheetTabDeleteMessage.title');
      const confirmBtnText = t('action.ok');
      const secondaryBtnText = t('action.cancel');
      const warning = {
        message,
        title,
        confirmBtnText,
        secondaryBtnText,
        onConfirm: () => {
          deleteSheet(label);
        },
      };
      dispatch(actions.showWarningMessage(warning));
    }
  };

  let component = null;
  if (isEditMode) {
    component = (
      <input type='text'
        className={classNames('sheet-input', { 'input-error': isInputError })}
        ref={inputRef}
        value={inputValue}
        onChange={onInputChange}
        onBlur={onInputBlur}
        onKeyDown={onKeyDown}
        aria-invalid={isInputError}
        aria-label={t('action.rename')}
      />
    );
  } else {
    component = (
      <>
        <Button
          role='tab'
          // ariaControls={'document-container'}
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
          <TabOptions id={label?.replace(/\s+/g, '-').toLowerCase()}
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