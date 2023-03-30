import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';

import { useSelector, useDispatch, useStore, shallowEqual } from 'react-redux';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import { useTranslation } from 'react-i18next';

import ActionButton from 'components/ActionButton';
import CustomizablePopup from 'components/CustomizablePopup';
import Icon from 'components/Icon';

import useOnClickOutside from 'hooks/useOnClickOutside';
import useOnRightClick from 'src/hooks/useOnRightClick';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import { isMobile as isMobileCSS, isIE, isMobileDevice, isFirefox } from 'helpers/device';
import DataElements from 'src/constants/dataElement';
import { workerTypes } from 'constants/types';

import './ContextMenuPopup.scss';

const OfficeActionItem = ({ onClick, img, title, shortcut = '', disabled = false }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !disabled) {
      onClick();
      dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP));
    }
  };

  return (
    <div
      className={classNames('office-action-item', { disabled })}
      onClick={() => !disabled && onClick()}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
    >
      <div className="icon-title">
        <Icon glyph={img} disabled={disabled} />
        <div>{t(title)}</div>
      </div>
      <div className="shortcut">{shortcut}</div>
    </div>
  );
};

const ContextMenuPopup = ({
  closeElements,
}) => {
  const [
    isOpen,
    isDisabled,
    popupItems,
    isRightClickAnnotationPopupEnabled,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElements.CONTEXT_MENU_POPUP),
      selectors.isElementDisabled(state, DataElements.CONTEXT_MENU_POPUP),
      selectors.getPopupItems(state, DataElements.CONTEXT_MENU_POPUP),
      selectors.isRightClickAnnotationPopupEnabled(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  // this is hacky, hopefully we can remove this when tool group button is restructured
  const store = useStore();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const popupRef = useRef();
  // if right click menu is not turned on, on tablet + phone, ContextMenuPopup won't be available
  // if it's on, on tablet + phone, it will be available without being draggable
  const isMobile = !!isMobileDevice || isMobileCSS();

  useOnClickOutside(popupRef, () => {
    dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP));
  });

  useEffect(() => {
    if (isOpen) {
      closeElements();
    }
  }, [isOpen]);

  useOnRightClick(
    useCallback((e) => {
      let { pageX: left, pageY: top } = e;
      const { width, height } = popupRef.current.getBoundingClientRect();
      const documentContainer = document.querySelector('.DocumentContainer');
      const containerBox = documentContainer.getBoundingClientRect();
      const horizontalGap = 2;
      const verticalGap = 2;

      if (left < containerBox.left) {
        left = containerBox.left + horizontalGap;
      }
      if (left + width > containerBox.right) {
        left = containerBox.right - width - horizontalGap;
      }

      if (top < containerBox.top) {
        top = containerBox.top + verticalGap;
      }
      if (top + height > containerBox.bottom) {
        top = containerBox.bottom - height - verticalGap;
      }

      const annotationUnderMouse = core.getAnnotationByMouseEvent(e);
      if ((!isRightClickAnnotationPopupEnabled && !isMobile) || (isRightClickAnnotationPopupEnabled && !annotationUnderMouse)) {
        if (popupItems.length > 0) {
          setPosition({ left, top });
          dispatch(actions.openElement(DataElements.CONTEXT_MENU_POPUP));
        }
      }
    }, [popupItems, isRightClickAnnotationPopupEnabled])
  );

  const isOfficeEditor = core.getDocument()?.getType() === workerTypes.OFFICE_EDITOR;

  if (isDisabled) {
    return null;
  }

  const contextMenuPopup = (
    <div
      className={classNames('Popup', 'ContextMenuPopup', {
        open: isOpen,
        closed: !isOpen,
        isOfficeEditor,
        'is-vertical': isRightClickAnnotationPopupEnabled && !isOfficeEditor,
        'is-horizontal': !isRightClickAnnotationPopupEnabled && !isOfficeEditor,
      })}
      ref={popupRef}
      data-element={DataElements.CONTEXT_MENU_POPUP}
      style={{ ...position }}
      onClick={() => dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP))}
    >
      <FocusTrap locked={isOpen}>
        <div className="container">
          {isOfficeEditor ? (
            <>
              <OfficeActionItem
                title="action.cut"
                img="icon-cut"
                onClick={async () => {
                  await core.getOfficeEditor().copySelectedText();
                  core.getOfficeEditor().removeSelection();
                }}
                shortcut="Ctrl+X"
                disabled={!core.getOfficeEditor().isTextSelected()}
              />
              <OfficeActionItem
                title="action.copy"
                img="icon-copy"
                onClick={() => core.getOfficeEditor().copySelectedText()}
                shortcut="Ctrl+C"
                disabled={!core.getOfficeEditor().isTextSelected()}
              />
              {!isFirefox && (
                <>
                  <OfficeActionItem
                    title="action.paste"
                    img="icon-paste"
                    onClick={() => core.getOfficeEditor().pasteText()}
                    shortcut="Ctrl+V"
                  />
                  <OfficeActionItem
                    title="action.pasteWithoutFormatting"
                    img="icon-paste-without-formatting"
                    onClick={() => core.getOfficeEditor().pasteText(false)}
                    shortcut="Ctrl+Shift+V"
                  />
                </>
              )}
              <OfficeActionItem
                title="action.delete"
                img="icon-delete-line"
                onClick={() => core.getOfficeEditor().removeSelection()}
                disabled={!core.getOfficeEditor().isTextSelected()}
              />
            </>
          ) : (
            <CustomizablePopup
              dataElement={DataElements.CONTEXT_MENU_POPUP}
              childrenClassName="main-menu-button"
            >
              <ActionButton
                className="main-menu-button"
                dataElement="panToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'tool.pan' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'tool.pan' : ''}
                img="icon-header-pan"
                onClick={() => setToolModeAndGroup(store, 'Pan')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="stickyToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.stickyNote' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.stickyNote' : ''}
                img="icon-tool-comment-line"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateSticky')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="highlightToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.highlight' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.highlight' : ''}
                img="icon-tool-highlight"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateTextHighlight')
                }
              />
              <ActionButton
                className="main-menu-button"
                dataElement="freeHandToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.freehand' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.freehand' : ''}
                img="icon-tool-pen-line"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeHand')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="freeHandHighlightToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.freeHandHighlight' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.freeHandHighlight' : ''}
                img="icon-tool-pen-highlight"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeHandHighlight')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="freeTextToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.freetext' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.freetext' : ''}
                img="icon-tool-text-free-text"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeText')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="markInsertTextToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.markInsertText' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.markInsertText' : ''}
                img="ic-insert text"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateMarkInsertText')}
              />
              <ActionButton
                className="main-menu-button"
                dataElement="markReplaceTextToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'annotation.markReplaceText' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'annotation.markReplaceText' : ''}
                img="ic-replace text"
                onClick={() => setToolModeAndGroup(store, 'AnnotationCreateMarkReplaceText')}
              />
            </CustomizablePopup>
          )}
        </div>
      </FocusTrap>
    </div>
  );

  return isIE || isMobile ? (
    contextMenuPopup
  ) : (
    <Draggable cancel=".Button, .cell, .sliders-container svg, select, button, input">{contextMenuPopup}</Draggable>
  );
};

export default ContextMenuPopup;
