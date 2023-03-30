import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import Draggable from 'react-draggable';
import classNames from 'classnames';

import ActionButton from 'components/ActionButton';
import CustomizablePopup from 'components/CustomizablePopup';

import core from 'core';
import { getTextPopupPositionBasedOn } from 'helpers/getPopupPosition';
import createTextAnnotationAndSelect from 'helpers/createTextAnnotationAndSelect';
import copyText from 'helpers/copyText';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import selectors from 'selectors';
import { isMobile, isIE } from 'helpers/device';
import DataElements from 'src/constants/dataElement';

import './TextPopup.scss';

const TextPopup = ({ t }) => {
  const [
    isDisabled,
    isOpen,
    popupItems,
    isRightClickAnnotationPopupEnabled,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, DataElements.TEXT_POPUP),
      selectors.isElementOpen(state, DataElements.TEXT_POPUP),
      selectors.getPopupItems(state, DataElements.TEXT_POPUP),
      selectors.isRightClickAnnotationPopupEnabled(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [quads, setQuads] = useState(null);
  const popupRef = useRef();
  useOnClickOutside(popupRef, () => {
    dispatch(actions.closeElement(DataElements.TEXT_POPUP));
    setQuads(null);
  });

  const setPopupPositionAndShow = () => {
    if (popupRef.current && popupItems.length > 0 && quads) {
      setPosition(getTextPopupPositionBasedOn(quads, popupRef));
      dispatch(actions.openElement(DataElements.TEXT_POPUP));
    }
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements([
        DataElements.ANNOTATION_POPUP,
        DataElements.CONTEXT_MENU_POPUP,
        DataElements.INLINE_COMMENT_POPUP,
      ]));
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    const textSelectTool = core.getTool('TextSelect');
    const onSelectionComplete = (startQuad, allQuads) => {
      if (popupRef.current && popupItems.length > 0) {
        setPosition(getTextPopupPositionBasedOn(allQuads, popupRef));
        setQuads(allQuads);
        dispatch(actions.openElement(DataElements.TEXT_POPUP));
      }
    };

    textSelectTool.addEventListener('selectionComplete', onSelectionComplete);
    return () => textSelectTool.removeEventListener('selectionComplete', onSelectionComplete);
  }, [dispatch, popupItems]);

  const onClose = useCallback(() => dispatch(actions.closeElement(DataElements.TEXT_POPUP)), [dispatch]);

  useEffect(() => {
    const onScroll = _.debounce(() => {
      setPopupPositionAndShow();
    }, 100);
    const scrollViewElement = core.getDocumentViewer().getScrollViewElement();
    scrollViewElement?.addEventListener('scroll', onScroll);

    return () => {
      scrollViewElement?.removeEventListener('scroll', onScroll);
    };
  }, [quads]);

  if (isDisabled) {
    return null;
  }

  const textPopup = (
    <div
      className={classNames({
        Popup: true,
        TextPopup: true,
        open: isOpen,
        closed: !isOpen,
        'is-vertical': isRightClickAnnotationPopupEnabled,
        'is-horizontal': !isRightClickAnnotationPopupEnabled,
      })}
      data-element={DataElements.TEXT_POPUP}
      ref={popupRef}
      style={{ ...position }}
      onClick={onClose}
      role="listbox"
      aria-label={t('component.textPopup')}
    >
      <FocusTrap locked={isOpen}>
        <div className="container">
          <CustomizablePopup
            dataElement={DataElements.TEXT_POPUP}
            childrenClassName="main-menu-button"
          >
            <ActionButton
              className="main-menu-button"
              dataElement="copyTextButton"
              label={isRightClickAnnotationPopupEnabled ? 'action.copy' : ''}
              title={!isRightClickAnnotationPopupEnabled ? 'action.copy' : ''}
              img="ic_copy_black_24px"
              onClick={() => copyText()}
              role="option"
            />
            <ActionButton
              className="main-menu-button"
              dataElement="textHighlightToolButton"
              label={isRightClickAnnotationPopupEnabled ? 'annotation.highlight' : ''}
              title={!isRightClickAnnotationPopupEnabled ? 'annotation.highlight' : ''}
              img="icon-tool-highlight"
              onClick={() => createTextAnnotationAndSelect(dispatch, window.Core.Annotations.TextHighlightAnnotation)}
              role="option"
            />
            <ActionButton
              className="main-menu-button"
              dataElement="textUnderlineToolButton"
              label={isRightClickAnnotationPopupEnabled ? 'annotation.underline' : ''}
              title={!isRightClickAnnotationPopupEnabled ? 'annotation.underline' : ''}
              img="icon-tool-text-manipulation-underline"
              onClick={() => createTextAnnotationAndSelect(dispatch, window.Core.Annotations.TextUnderlineAnnotation)}
              role="option"
            />
            <ActionButton
              className="main-menu-button"
              dataElement="textSquigglyToolButton"
              label={isRightClickAnnotationPopupEnabled ? 'annotation.squiggly' : ''}
              title={!isRightClickAnnotationPopupEnabled ? 'annotation.squiggly' : ''}
              img="icon-tool-text-manipulation-squiggly"
              onClick={() => createTextAnnotationAndSelect(dispatch, window.Core.Annotations.TextSquigglyAnnotation)}
              role="option"
            />
            <ActionButton
              className="main-menu-button"
              label={isRightClickAnnotationPopupEnabled ? 'annotation.strikeout' : ''}
              title={!isRightClickAnnotationPopupEnabled ? 'annotation.strikeout' : ''}
              img="icon-tool-text-manipulation-strikethrough"
              onClick={() => createTextAnnotationAndSelect(dispatch, window.Core.Annotations.TextStrikeoutAnnotation)}
              dataElement="textStrikeoutToolButton"
              role="option"
            />
            <ActionButton
              className="main-menu-button"
              label={isRightClickAnnotationPopupEnabled ? 'tool.Link' : ''}
              title={!isRightClickAnnotationPopupEnabled ? 'tool.Link' : ''}
              img="icon-tool-link"
              onClick={() => dispatch(actions.openElement(DataElements.LINK_MODAL))}
              dataElement="linkButton"
              role="option"
            />
            {core.isCreateRedactionEnabled() && (
              <ActionButton
                className="main-menu-button"
                dataElement="textRedactToolButton"
                label={isRightClickAnnotationPopupEnabled ? 'option.redaction.markForRedaction' : ''}
                title={!isRightClickAnnotationPopupEnabled ? 'option.redaction.markForRedaction' : ''}
                fillColor="868E96"
                img="icon-tool-select-area-redaction"
                onClick={() => createTextAnnotationAndSelect(dispatch, window.Core.Annotations.RedactionAnnotation)}
                role="option"
              />
            )}
          </CustomizablePopup>
        </div>
      </FocusTrap>
    </div>
  );

  return isIE || isMobile() ? (
    textPopup
  ) : (
    <Draggable cancel=".Button, .cell, .sliders-container svg, select, button, input">{textPopup}</Draggable>
  );
};

export default withTranslation()(TextPopup);
