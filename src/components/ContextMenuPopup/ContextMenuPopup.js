import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, useStore, shallowEqual } from 'react-redux';

import ActionButton from 'components/ActionButton';
import CustomizablePopup from 'components/CustomizablePopup';

import useOnClickOutside from 'hooks/useOnClickOutside';
import setToolModeAndGroup from 'helpers/setToolModeAndGroup';
import actions from 'actions';
import selectors from 'selectors';

import './ContextMenuPopup.scss';

const ContextMenuPopup = () => {
  const [isOpen, isDisabled, popupItems] = useSelector(
    state => [
      selectors.isElementOpen(state, 'contextMenuPopup'),
      selectors.isElementDisabled(state, 'contextMenuPopup'),
      selectors.getPopupItems(state, 'contextMenuPopup'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  // this is hacky, hopefully we can remove this when tool group button is restructured
  const store = useStore();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const popupRef = useRef();

  useOnClickOutside(popupRef, () => {
    dispatch(actions.closeElement('contextMenuPopup'));
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements(['annotationPopup', 'textPopup']));
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    const onContextMenu = e => {
      const { tagName } = e.target;
      const clickedOnInput = tagName === 'INPUT';
      const clickedOnTextarea = tagName === 'TEXTAREA';
      const clickedOnDocumentContainer = document
        .querySelector('.DocumentContainer')
        .contains(e.target);

      if (
        popupRef.current &&
        clickedOnDocumentContainer &&
        // when clicking on these two elements we want to display the default context menu
        // so that users can use auto-correction, look up dictionary, etc...
        !(clickedOnInput || clickedOnTextarea)
      ) {
        e.preventDefault();
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
        if (popupItems.length > 0) {
          setPosition({ left, top });
          dispatch(actions.openElement('contextMenuPopup'));
        }
      }
    };

    document.addEventListener('contextmenu', onContextMenu);
    return () => document.removeEventListener('contextmenu', onContextMenu);
  }, [dispatch, popupItems]);

  return isDisabled ? null : (
    <div
      className={classNames({
        Popup: true,
        ContextMenuPopup: true,
        open: isOpen,
        closed: !isOpen,
      })}
      ref={popupRef}
      data-element="contextMenuPopup"
      style={{ ...position }}
      onClick={() => dispatch(actions.closeElement('contextMenuPopup'))}
    >
      <CustomizablePopup dataElement="contextMenuPopup">
        <ActionButton
          dataElement="panToolButton"
          title="tool.pan"
          img="icon-header-pan"
          onClick={() => setToolModeAndGroup(store, 'Pan')}
        />
        <ActionButton
          dataElement="stickyToolButton"
          title="annotation.stickyNote"
          img="icon-tool-comment-line"
          onClick={() => setToolModeAndGroup(store, 'AnnotationCreateSticky')}
        />
        <ActionButton
          dataElement="highlightToolButton"
          title="annotation.highlight"
          img="icon-tool-highlight"
          onClick={() =>
            setToolModeAndGroup(store, 'AnnotationCreateTextHighlight')
          }
        />
        <ActionButton
          dataElement="freeHandToolButton"
          title="annotation.freehand"
          img="icon-tool-pen-line"
          onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeHand')}
        />
        <ActionButton
          dataElement="freeHandHighlightToolButton"
          title="annotation.freeHandHighlight"
          img="icon-tool-pen-highlight"
          onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeHandHighlight')}
        />
        <ActionButton
          dataElement="freeTextToolButton"
          title="annotation.freetext"
          img="icon-tool-text-free-text"
          onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeText')}
        />
      </CustomizablePopup>
    </div>
  );
};

export default ContextMenuPopup;
