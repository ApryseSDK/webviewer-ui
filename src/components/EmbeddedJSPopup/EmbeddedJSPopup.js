import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';
import EmbeddedJSPopupMenu from './EmbeddedJSPopupMenu';

import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';

import './EmbeddedJSPopup.scss';

const EmbeddedJSPopup = () => {
  const documentViewer = core.getDocumentViewer();
  const annotManager = core.getAnnotationManager();
  const fieldManager = annotManager.getFieldManager();
  const [isOpen, isDisabled] = useSelector(
    (state) => [
      selectors.isElementOpen(state, DataElements.EMBEDDED_JS_POPUP),
      selectors.isElementDisabled(state, DataElements.EMBEDDED_JS_POPUP),
    ],
    shallowEqual,
  );

  if (isDisabled) {
    return (null);
  }

  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [popUpMenuItems, setPopUpMenuItems] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const popupRef = useRef();

  useOnClickOutside(popupRef, () => {
    dispatch(actions.closeElement(DataElements.EMBEDDED_JS_POPUP));
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements([
        DataElements.ANNOTATION_POPUP,
        DataElements.TEXT_POPUP,
      ]));
    }
  }, [dispatch, isOpen]);

  const onFieldClick = (e) => {
    setPosition({
      left: `${parseInt(e.x, 10) + 10}px`,
      top: `${parseInt(e.y, 10)}px`,
    });
  };

  useEffect(() => {
    let field;
    const onPopUpMenu = (e) => {
      setPopupData(e);
      setPopUpMenuItems(e.popUpMenuItems);
      field = fieldManager.getField(e.fieldName);
      field.widgets.forEach((widget) => {
        const element = widget.element;
        element.addEventListener('click', onFieldClick);
      });
      dispatch(actions.openElement(DataElements.EMBEDDED_JS_POPUP));
    };

    documentViewer.addEventListener('embeddedPopUpMenu', onPopUpMenu);
    return () => {
      documentViewer.removeEventListener('embeddedPopUpMenu', onPopUpMenu);
    };
  }, [dispatch]);

  const clickMenuItem = (value) => {
    if (popupData) {
      popupData.onSelect(value);
    }
    dispatch(actions.closeElement(DataElements.EMBEDDED_JS_POPUP));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <DataElementWrapper
      dataElement={DataElements.EMBEDDED_JS_POPUP}
      ref={popupRef}
    >
      <EmbeddedJSPopupMenu
        isSubOpen={isOpen}
        left={position.left}
        top={position.top}
        onSelectOption={clickMenuItem}
        popUpMenuItems={popUpMenuItems}
      />
    </DataElementWrapper>
  );
};

export default EmbeddedJSPopup;
