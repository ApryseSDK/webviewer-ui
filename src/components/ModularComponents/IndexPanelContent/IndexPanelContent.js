import React, {
  forwardRef,
  useEffect,
  useState,
  useRef,
} from 'react';
import './IndexPanelContent.scss';
import actions from 'actions';
import Button from 'components/Button';
import core from 'core';
import { Input } from '@pdftron/webviewer-react-toolkit';
import mapValidationResponseToTranslation from 'src/helpers/mapValidationResponseToTranslation';
import { getDataWithKey, mapAnnotationToKey } from 'constants/map';
import PropTypes from 'prop-types';
import DataElements from 'constants/dataElement';
import { useTranslation } from 'react-i18next';
import PanelListItem from 'src/components/PanelListItem';
import { menuTypes } from '../../MoreOptionsContextMenuFlyout/MoreOptionsContextMenuFlyout';
import selectors from 'selectors';
import { useSelector, useDispatch } from 'react-redux';

const propTypes = {
  isMultiSelectionMode: PropTypes.bool,
  fieldName: PropTypes.string,
  widgetId: PropTypes.string,
  icon: PropTypes.string,
  setSelected: PropTypes.func,
  isActive: PropTypes.bool,
  handleDeletion: PropTypes.func,
  isSubLevel: PropTypes.bool,
  childWidgets: PropTypes.array,
  selectingWidgets: PropTypes.array,
};

const IndexPanelContent = forwardRef(({
  isSubLevel,
  isMultiSelectionMode,
  fieldName: defaultFiledName,
  widgetId,
  icon,
  setSelected,
  isActive,
  handleDeletion,
  childWidgets,
  selectingWidgets,
}, ref) => {

  const [t] = useTranslation();
  const [isDefault, setIsDefault] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fieldName, setFieldName] = useState(defaultFiledName);
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const inputRef = useRef();
  const dispatch = useDispatch();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      if ((isEditing)) {
        onSaveFieldName();
      }
    }
    if (e.key === 'Escape') {
      onCloseRenaming();
    }
  };


  const handleFieldNameChange = (e) => {
    setIsValid(true);
    setFieldName(e.target.value);
  };

  const onSaveFieldName = () => {
    const formFieldCreationManager = core.getFormFieldCreationManager();
    let validatedResponse = null;
    let validationResponse = null;
    if (!widgetId) {
      childWidgets.forEach((child) => {
        validatedResponse = formFieldCreationManager.setFieldName(child, fieldName);
      });
    } else {
      const widget = core.getAnnotationById(widgetId);
      validatedResponse = formFieldCreationManager.setFieldName(widget, fieldName);
    }
    setIsValid(validatedResponse.isValid);
    validationResponse = mapValidationResponseToTranslation(validatedResponse);
    setValidationMessage(validationResponse);
    if (validatedResponse.isValid) {
      onCloseRenaming();
    }
  };

  const onCloseRenaming = () => {
    isEditing && setFieldName(defaultFiledName);
    setIsEditing(false);
    setIsValid(true);
  };

  const handleOnBlur = (e) => {
    const isClickBtn = e.relatedTarget && (e.relatedTarget.className.includes('index-panel-save-button') ||
    e.relatedTarget.className.includes('index-panel-cancel-button'));
    if (isClickBtn) {
      e.preventDefault();
      return;
    }
    onCloseRenaming();
  };

  useEffect(() => {
    if (fieldName !== defaultFiledName) {
      setFieldName(defaultFiledName);
    }
  }, [defaultFiledName]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
      inputRef.current.select();
    }
    if (!isEditing) {
      setIsDefault(true);
    } else {
      setIsDefault(false);
    }
  }, [isEditing]);


  const flyoutSelector = `${DataElements.BOOKMARK_OUTLINE_FLYOUT}-${widgetId}`;
  const currentFlyout = useSelector((state) => selectors.getFlyout(state, flyoutSelector));

  const handleOnClick = (val) => {
    switch (val) {
      case menuTypes.OPENFORMFIELDPANEL:
        dispatch(actions.openElement(DataElements.FORM_FIELD_PANEL));
        setSelected(widgetId);
        break;
      case menuTypes.RENAME:
        setIsEditing(true);
        break;
      case menuTypes.DELETE:
        if (!widgetId) {
          childWidgets.forEach((child) => {
            handleDeletion(child['Id']);
          });
          return;
        }
        handleDeletion(widgetId);
        break;
      default:
        break;
    }
  };

  const contextMenuMoreButtonOptions = {
    moreOptionsDataElement: `index-panel-more-button-${widgetId}`,
    flyoutToggleElement: flyoutSelector,
  };

  const contentMenuFlyoutOptions = {
    shouldHideDeleteButton: false,
    currentFlyout,
    flyoutSelector,
    type: widgetId ? 'indexPanel' : 'indexPanel.folder',
    handleOnClick,
  };

  const checkboxOptions = {
    id: widgetId,
    checked: isActive,
    onChange: (e) => {
      if (!widgetId) {
        setSelected(widgetId, e.target.checked, childWidgets);
        return;
      }
      setSelected(widgetId, e.target.checked);
    },
    'aria-label': 'index panel checkbox',
    'aria-checked': isActive,
  };

  const renderContent = (widget) => {
    const icon = getDataWithKey(mapAnnotationToKey(widget)).icon;
    const { fieldName, Id } = widget;
    return (
      <IndexPanelContent
        key={Id}
        isMultiSelectionMode={isMultiSelectionMode}
        fieldName={fieldName}
        icon={icon}
        widgetId={Id}
        setSelected={setSelected}
        isActive={selectingWidgets.includes(Id)}
        handleDeletion={handleDeletion}
        isSubLevel={true}
      />
    );
  };

  return (
    <div
      className="index-drag-container"
      key={widgetId}
      ref={ref}
    >
      {isDefault && <PanelListItem
        iconGlyph={icon}
        labelHeader={isSubLevel ? widgetId : defaultFiledName}
        enableMoreOptionsContextMenuFlyout={true}
        onDoubleClick={() => setIsEditing(true)}
        onClick={() => !isMultiSelectionMode && setSelected(widgetId)}
        contextMenuMoreButtonOptions={contextMenuMoreButtonOptions}
        contentMenuFlyoutOptions={contentMenuFlyoutOptions}
        checkboxOptions={isMultiSelectionMode && checkboxOptions || null}
        isActive={isActive}
      >
        {childWidgets?.map((widget) => {
          return renderContent(widget);
        })}
      </PanelListItem>}
      {isEditing && (
        <div className='index-panel-single-container'>
          <div className="index-panel-label-row">
            <div className='index-panel_content-container'>
              <Input
                type="text"
                name="field-name"
                ref={inputRef}
                className="index-panel-outline-input index-panel-text-input"
                aria-label={t('action.name')}
                value={fieldName}
                onKeyDown={handleKeyDown}
                onChange={handleFieldNameChange}
                fillWidth="false"
                onBlur={handleOnBlur}
                messageText={!isValid ? t(validationMessage) : ''}
                message={!isValid ? 'warning' : 'default'}
              />
            </div>
            <div className="index-panel-editing-controls">
              <Button
                className="index-panel-cancel-button"
                label={t('action.cancel')}
                onClick={onCloseRenaming}
              />
              <Button
                className="index-panel-save-button"
                label={t('action.save')}
                isSubmitType
                onClick={onSaveFieldName}
                disabled={!isValid || fieldName === defaultFiledName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

IndexPanelContent.displayName = 'IndexPanelContent';
IndexPanelContent.propTypes = propTypes;

export default IndexPanelContent;