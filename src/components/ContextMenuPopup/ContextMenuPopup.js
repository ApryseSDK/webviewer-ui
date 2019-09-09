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
  const [isOpen, isDisabled] = useSelector(
    state => [
      selectors.isElementOpen(state, 'contextMenuPopup'),
      selectors.isElementDisabled(state, 'contextMenuPopup'),
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

        setPosition({ left, top });
        dispatch(actions.openElement('contextMenuPopup'));
      }
    };

    document.addEventListener('contextmenu', onContextMenu);
    return () => document.removeEventListener('contextmenu', onContextMenu);
  }, [dispatch]);

  const dataElementButtonMap = {
    panToolButton: overrides => (
      <ActionButton
        title="tool.pan"
        img="ic_pan_black_24px"
        onClick={() => setToolModeAndGroup(store, 'Pan')}
        {...overrides}
        dataElement="panToolButton"
      />
    ),
    stickyToolButton: overrides => (
      <ActionButton
        title="annotation.stickyNote"
        img="ic_annotation_sticky_note_black_24px"
        onClick={() => setToolModeAndGroup(store, 'AnnotationCreateSticky')}
        {...overrides}
        dataElement="stickyToolButton"
      />
    ),
    highlightToolButton: overrides => (
      <ActionButton
        title="annotation.highlight"
        img="ic_annotation_highlight_black_24px"
        onClick={() =>
          setToolModeAndGroup(store, 'AnnotationCreateTextHighlight')
        }
        {...overrides}
        dataElement="highlightToolButton"
      />
    ),
    freeHandToolButton: overrides => (
      <ActionButton
        title="annotation.freehand"
        img="ic_annotation_freehand_black_24px"
        onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeHand')}
        {...overrides}
        dataElement="freeHandToolButton"
      />
    ),
    freeTextToolButton: overrides => (
      <ActionButton
        title="annotation.freetext"
        img="ic_annotation_freetext_black_24px"
        onClick={() => setToolModeAndGroup(store, 'AnnotationCreateFreeText')}
        {...overrides}
        dataElement="freeTextToolButton"
      />
    ),
  };

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
        {dataElementButtonMap}
      </CustomizablePopup>
    </div>
  );
};

export default ContextMenuPopup;
