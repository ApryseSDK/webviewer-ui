import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import DataElements from 'constants/dataElement';
import DataElementWrapper from 'components/DataElementWrapper';
import EmbeddedJSPopupMenu from './EmbeddedJSPopupMenu';

import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import selectors from 'selectors';
import useCore from 'hooks/useCore';
import { getMouseEventPosition } from 'helpers/getPopupPosition';

import './EmbeddedJSPopup.scss';

const EmbeddedJSPopup = () => {
  const { core } = useCore();
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
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

  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [popUpMenuItems, setPopUpMenuItems] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const popupRef = useRef();

  useOnClickOutside(popupRef, () => {
    dispatch(actions.closeElement(DataElements.EMBEDDED_JS_POPUP));
  });

  useEffect(() => {
    if (isOpen && !isDisabled) {
      dispatch(actions.closeElements([
        DataElements.ANNOTATION_POPUP,
        DataElements.TEXT_POPUP,
      ]));
    }
  }, [dispatch, isOpen, isDisabled]);

  const onFieldClick = (e) => {
    const { top, left } = getMouseEventPosition(e);

    setPosition({
      left: `${left + 10}px`,
      top: `${top}px`,
    });
  };

  useEffect(() => {
    if (isDisabled) {
      return;
    }
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
  }, [dispatch, activeDocumentViewerKey, isDisabled]);

  const clickMenuItem = (value) => {
    if (popupData) {
      popupData.onSelect(value);
    }
    dispatch(actions.closeElement(DataElements.EMBEDDED_JS_POPUP));
  };

  if (isDisabled || !isOpen) {
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
