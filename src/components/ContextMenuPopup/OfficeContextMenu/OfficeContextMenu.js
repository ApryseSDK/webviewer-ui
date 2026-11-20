import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import OfficeActionItem from './OfficeActionItem';
import OfficeSuggestions from './OfficeSuggestions';
import actions from 'actions';
import selectors from 'selectors';
import useCore from 'hooks/useCore';
import { isFirefox, isMac } from 'helpers/device';
import DataElements from 'constants/dataElement';
import { EditingStreamType } from 'constants/officeEditor';
import { ITEM_TYPE } from 'constants/customizationVariables';
import { OFFICE_EDITOR_CONTEXT_MENU_TABLE_DIVIDER } from 'src/redux/officeEditorModularComponents';

const OfficeContextMenu = ({
  spellingErrorId,
  misspelledWord,
}) => {
  const { core } = useCore();
  const officeEditor = core.getOfficeEditor();

  const [t] = useTranslation();
  const dispatch = useDispatch();

  const popupItems = useSelector(
    (state) => selectors.getPopupItems(state, DataElements.CONTEXT_MENU_POPUP),
    shallowEqual,
  );
  const isCursorInTable = useSelector(selectors.isCursorInTable);
  const activeStream = useSelector(selectors.getOfficeEditorActiveStream);

  const modifierKey = isMac ? '⌘ Command' : 'Ctrl';
  const modifierKeyShort = isMac ? '⌘Cmd' : 'Ctrl';

  const handlePaste = (withFormatting = true) => {
    if (!isFirefox) {
      officeEditor.pasteText(withFormatting);
      return;
    }

    const title = withFormatting ? t('officeEditor.pastingTitle') : t('officeEditor.pastingWithoutFormatTitle');
    const message = withFormatting ? t('officeEditor.pastingMessage') : t('officeEditor.pastingWithoutFormatMessage');
    const keyboardShortcut = withFormatting ? `${modifierKey} + V` : `${modifierKey} + Shift + V`;
    const confirmBtnText = t('action.close');

    const warning = {
      message: `${message}:\n\n${keyboardShortcut}`,
      title,
      confirmBtnText,
      onConfirm: () => {
        // setTimeout needed because the focus can not be set immediately after closing the warning modal
        setTimeout(() => {
          core.getViewerElement().focus();
        });
      },
      onCancel: () => {
        setTimeout(() => {
          core.getViewerElement().focus();
        });
      },
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const getTableActionItem = (title, onClick) => ({ title, onClick });

  const getTableOnlyOfficePopupItem = (dataElement) => {
    switch (dataElement) {
      case OFFICE_EDITOR_CONTEXT_MENU_TABLE_DIVIDER:
        return { type: ITEM_TYPE.DIVIDER };
      case DataElements.OFFICE_EDITOR_INSERT_ROW_ABOVE:
        return getTableActionItem('officeEditor.insertRowAbove', () => officeEditor.insertRows(true));
      case DataElements.OFFICE_EDITOR_INSERT_ROW_BELOW:
        return getTableActionItem('officeEditor.insertRowBelow', () => officeEditor.insertRows(false));
      case DataElements.OFFICE_EDITOR_INSERT_COLUMN_RIGHT:
        return getTableActionItem('officeEditor.insertColumnRight', () => officeEditor.insertColumns(true));
      case DataElements.OFFICE_EDITOR_INSERT_COLUMN_LEFT:
        return getTableActionItem('officeEditor.insertColumnLeft', () => officeEditor.insertColumns(false));
      case DataElements.OFFICE_EDITOR_DELETE_ROW:
        return getTableActionItem('officeEditor.deleteRow', () => officeEditor.removeRows());
      case DataElements.OFFICE_EDITOR_DELETE_COLUMN:
        return getTableActionItem('officeEditor.deleteColumn', () => officeEditor.removeColumns());
      case DataElements.OFFICE_EDITOR_DELETE_TABLE:
        return getTableActionItem('officeEditor.deleteTable', () => officeEditor.removeTable());
      default:
        return undefined;
    }
  };

  // `null` means the item should be explicitly hidden for current context.
  // `undefined` means there is no built-in default mapping, so caller can still render custom action items.
  const getDefaultOfficePopupItemProps = (dataElement) => {
    const tableOnlyItem = getTableOnlyOfficePopupItem(dataElement);
    if (tableOnlyItem) {
      return isCursorInTable ? tableOnlyItem : null;
    }

    if (dataElement === DataElements.OFFICE_EDITOR_DELETE && isCursorInTable) {
      return null;
    }

    switch (dataElement) {
      case DataElements.OFFICE_EDITOR_CUT:
        return {
          title: 'action.cut',
          img: 'icon-cut',
          onClick: () => officeEditor.cutSelectedText(),
          shortcut: `${modifierKeyShort}+X`,
          disabled: !officeEditor.isTextSelected(),
        };
      case DataElements.OFFICE_EDITOR_COPY:
        return {
          title: 'action.copy',
          img: 'icon-copy',
          onClick: () => officeEditor.copySelectedText(),
          shortcut: `${modifierKeyShort}+C`,
          disabled: !officeEditor.isTextSelected(),
        };
      case DataElements.OFFICE_EDITOR_PASTE:
        return {
          title: 'action.paste',
          img: 'icon-paste',
          onClick: () => handlePaste(),
          shortcut: `${modifierKeyShort}+V`,
        };
      case DataElements.OFFICE_EDITOR_PASTE_WITHOUT_FORMATTING:
        return {
          title: 'action.pasteWithoutFormatting',
          img: 'icon-paste-without-formatting',
          onClick: () => handlePaste(false),
          shortcut: `${modifierKeyShort}+Shift+V`,
        };
      case DataElements.OFFICE_EDITOR_ADD_COMMENT:
        return {
          title: 'action.addComment',
          img: 'icon-tool-comment-line',
          onClick: () => officeEditor.getCommentManager().addCommentThreadAtCurrentRange(''),
          disabled: activeStream !== EditingStreamType.BODY,
        };
      case DataElements.OFFICE_EDITOR_DELETE:
        return {
          title: 'action.delete',
          img: 'icon-delete-line',
          onClick: () => officeEditor.removeSelection(),
          disabled: !(officeEditor.isTextSelected() || officeEditor.isImageSelected()),
        };
      default:
        return undefined;
    }
  };

  const renderOfficePopupItem = (item, index) => {
    const mediaQueryClassName = item.hidden?.map((screen) => `hide-in-${screen}`).join(' ');
    const key = `${item.type || 'actionButton'}-${item.dataElement || index}`;

    if (item.dataElement === DataElements.OFFICE_EDITOR_SPELL_CHECK_SUGGESTIONS) {
      return (
        <OfficeSuggestions
          key={key}
          spellingErrorId={spellingErrorId}
          misspelledWord={misspelledWord}
        />
      );
    }

    const defaultOfficeItemProps = item.dataElement ? getDefaultOfficePopupItemProps(item.dataElement) : undefined;
    const shouldHideItem = defaultOfficeItemProps === null; // we explicitly filter out null items but allow undefined items that can be custom action items from the user
    if (shouldHideItem) {
      return null;
    }

    const officePopupItem = {
      ...defaultOfficeItemProps,
      ...item,
      mediaQueryClassName,
    };

    if (officePopupItem.type === 'divider' || officePopupItem.type === 'spacer') {
      return (
        <div
          key={key}
          data-element={officePopupItem.dataElement}
          className={classNames(officePopupItem.type === 'spacer' ? 'spacer' : 'divider', mediaQueryClassName)}
        />
      );
    }

    if (defaultOfficeItemProps || officePopupItem.type === 'actionButton') {
      return (
        <OfficeActionItem
          key={key}
          {...officePopupItem}
        />
      );
    }

    return null;
  };

  // Rendered inside ErrorBoundaryComponent so item-building errors are caught.
  return popupItems.map(renderOfficePopupItem);
};

OfficeContextMenu.propTypes = {
  spellingErrorId: PropTypes.number,
  misspelledWord: PropTypes.string,
};

export default React.memo(OfficeContextMenu);
