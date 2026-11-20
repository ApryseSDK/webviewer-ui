import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import { useSelector, useDispatch, useStore } from 'react-redux';
import FocusTrap from 'components/FocusTrap';
import ActionButton from 'components/ActionButton';
import CustomizablePopup from 'components/CustomizablePopup';
import ErrorBoundaryComponent from 'components/ErrorBoundaryComponent';
import OfficeContextMenu from './OfficeContextMenu';
import useOnClickOutside from 'hooks/useOnClickOutside';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import actions from 'actions';
import selectors from 'selectors';
import { isMobile as isMobileCSS, isIE, isMobileDevice } from 'helpers/device';
import { isOfficeEditorMode } from 'helpers/officeEditor';
import getRootNode from 'helpers/getRootNode';
import DataElements from 'constants/dataElement';
import COMPONENT_TYPES from 'constants/componentTypes';
import { SpreadsheetEditorEditMode } from 'constants/spreadsheetEditor';

import './ContextMenuPopup.scss';

const ContextMenuPopup = ({
  clickPosition,
  spellingErrorId,
  misspelledWord,
}) => {
  const isOfficeEditor = isOfficeEditorMode();

  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.CONTEXT_MENU_POPUP));
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.CONTEXT_MENU_POPUP));
  const isRightClickAnnotationPopupEnabled = useSelector(selectors.isRightClickAnnotationPopupEnabled);
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const isSpreadsheetEditorModeEnabled = useSelector(selectors.isSpreadsheetEditorModeEnabled);
  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const isReadOnlyMode = spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;

  const [isSpreadsheetAndReadOnlyMode, setIsSpreadsheetAndReadOnlyMode] = useState(isSpreadsheetEditorModeEnabled && isReadOnlyMode);

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
      dispatch(
        actions.closeElements([
          DataElements.ANNOTATION_POPUP,
          DataElements.TEXT_POPUP,
          DataElements.INLINE_COMMENT_POPUP,
        ])
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const isReadOnlyMode = spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;
    setIsSpreadsheetAndReadOnlyMode(isSpreadsheetEditorModeEnabled && isReadOnlyMode);
  }, [isSpreadsheetEditorModeEnabled, spreadsheetEditorEditMode]);

  useLayoutEffect(() => {
    if (isSpreadsheetAndReadOnlyMode) {
      return;
    }

    const documentContainerSelector = isMultiViewerMode ? `#DocumentContainer${activeDocumentViewerKey}` : '.DocumentContainer';
    const documentContainer = getRootNode().querySelector(documentContainerSelector);
    if (!documentContainer) {
      return;
    }

    const updatePosition = () => {
      const { width, height } = popupRef.current.getBoundingClientRect();
      const containerBox = documentContainer.getBoundingClientRect();
      const { left, top } = adjustPopupPosition(clickPosition, containerBox, width, height);
      setPosition((prev) => (prev.left === left && prev.top === top ? prev : { left, top }));
    };
    updatePosition();

    // Content such as spell check suggestions can load after the popup opens, so re-clamp whenever its size changes.
    // ResizeObserver callbacks run after layout but before paint, so the overflow is corrected before it is visible.
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(popupRef.current);
    return () => resizeObserver.disconnect();
  }, [clickPosition, isMultiViewerMode, activeDocumentViewerKey, isSpreadsheetAndReadOnlyMode]);

  /**
   * Adjusts the position of the popup relative to the container.
   */
  const adjustPopupPosition = (clickPos, containerBox, width, height) => {
    let { left, top } = clickPos;
    const { offsetLeft, offsetTop } = getOffsetAdjustments();

    left -= offsetLeft + window.scrollX;
    top -= offsetTop + window.scrollY;

    const horizontalGap = 2;
    const verticalGap = 2;

    if (left < containerBox.left - offsetLeft) {
      left = containerBox.left + horizontalGap - offsetLeft;
    }

    if (left + width > containerBox.right - offsetLeft) {
      left = containerBox.right - width - horizontalGap - offsetLeft;
    }

    if (top < containerBox.top - offsetTop) {
      top = containerBox.top + verticalGap - offsetTop;
    }

    if (top + height > containerBox.bottom - offsetTop) {
      top = containerBox.bottom - offsetTop - height - verticalGap;
    }

    return { left, top };
  };

  /**
   * Retrieves offset adjustments if the app is running inside a Web Component.
   */
  const getOffsetAdjustments = () => {
    let offsetLeft = 0;
    let offsetTop = 0;

    if (window.isApryseWebViewerWebComponent) {
      const host = getRootNode()?.host;
      const hostBoundingRect = host?.getBoundingClientRect();

      if (hostBoundingRect) {
        offsetLeft = hostBoundingRect.left;
        offsetTop = hostBoundingRect.top;

        // Include host scroll offsets
        offsetLeft += host.scrollLeft;
        offsetTop += host.scrollTop;
      }
    }
    return { offsetLeft, offsetTop };
  };

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
      css={position}
      onClick={() => dispatch(actions.closeElement(DataElements.CONTEXT_MENU_POPUP))}
    >
      <FocusTrap locked={isOpen && position.top !== 0 && position.left !== 0}>
        <div className="container">
          <ErrorBoundaryComponent
            dataElement={DataElements.CONTEXT_MENU_POPUP}
            componentType={COMPONENT_TYPES.POPUP}
          >
            {isOfficeEditor ? (
              <OfficeContextMenu spellingErrorId={spellingErrorId} misspelledWord={misspelledWord} />
            ) : (
              <CustomizablePopup
                dataElement={DataElements.CONTEXT_MENU_POPUP}
                childrenClassName='main-menu-button'
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
          </ErrorBoundaryComponent>
        </div>
      </FocusTrap>
    </div>
  );

  if (isSpreadsheetAndReadOnlyMode) {
    return null;
  }

  return isIE || isMobile ? (
    contextMenuPopup
  ) : (
    <Draggable cancel=".Button, .cell, .sliders-container svg, select, button, input">{contextMenuPopup}</Draggable>
  );
};

ContextMenuPopup.propTypes = {
  clickPosition: PropTypes.shape({
    left: PropTypes.number,
    top: PropTypes.number,
  }).isRequired,
  spellingErrorId: PropTypes.number,
  misspelledWord: PropTypes.string,
};

export default React.memo(ContextMenuPopup);
