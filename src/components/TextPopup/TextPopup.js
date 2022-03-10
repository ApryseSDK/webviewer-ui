import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import getHashParameters from 'helpers/getHashParameters';

import ActionButton from 'components/ActionButton';
import CustomizablePopup from 'components/CustomizablePopup';

import core from 'core';
import { getTextPopupPositionBasedOn } from 'helpers/getPopupPosition';
import createTextAnnotationAndSelect from 'helpers/createTextAnnotationAndSelect';
import copyText from 'helpers/copyText';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useArrowFocus from 'hooks/useArrowFocus';
import actions from 'actions';
import selectors from 'selectors';

import './TextPopup.scss';

const TextPopup = ({ t }) => {
  const fullAPI = !!getHashParameters('pdfnet', false);

  const [isDisabled, isOpen, popupItems] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'textPopup'),
      selectors.isElementOpen(state, 'textPopup'),
      selectors.getPopupItems(state, 'textPopup'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const popupRef = useRef();
  useOnClickOutside(popupRef, () => {
    dispatch(actions.closeElement('textPopup'));
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(actions.closeElements(['annotationPopup', 'contextMenuPopup']));
    }
  }, [dispatch, isOpen]);

  useEffect(() => {
    const textSelectTool = core.getTool('TextSelect');
    const onSelectionComplete = (startQuad, allQuads) => {
      if (popupRef.current && popupItems.length > 0) {
        setPosition(getTextPopupPositionBasedOn(allQuads, popupRef));
        dispatch(actions.openElement('textPopup'));
      }
    };

    textSelectTool.addEventListener('selectionComplete', onSelectionComplete);
    return () => textSelectTool.removeEventListener('selectionComplete', onSelectionComplete);
  }, [dispatch, popupItems]);

  const onClose = useCallback(() => dispatch(actions.closeElement('textPopup')), [dispatch]);
  useArrowFocus(!isDisabled && isOpen, onClose, popupRef);

  return isDisabled ? null : (
    <div
      className={classNames({
        Popup: true,
        TextPopup: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element="textPopup"
      ref={popupRef}
      style={{ ...position }}
      onClick={onClose}
      role="listbox"
      aria-label={t('component.textPopup')}
    >
      <CustomizablePopup dataElement="textPopup">
        <ActionButton dataElement="copyTextButton" title="action.copy" img="ic_copy_black_24px" onClick={copyText} role="option" />
        <ActionButton
          dataElement="textHighlightToolButton"
          title="annotation.highlight"
          img="icon-tool-highlight"
          onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.TextHighlightAnnotation)}
          role="option"
        />
        <ActionButton
          dataElement="textUnderlineToolButton"
          title="annotation.underline"
          img="icon-tool-text-manipulation-underline"
          onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.TextUnderlineAnnotation)}
          role="option"
        />
        <ActionButton
          dataElement="textSquigglyToolButton"
          title="annotation.squiggly"
          img="icon-tool-text-manipulation-squiggly"
          onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.TextSquigglyAnnotation)}
          role="option"
        />
        <ActionButton
          title="annotation.strikeout"
          img="icon-tool-text-manipulation-strikethrough"
          onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.TextStrikeoutAnnotation)}
          dataElement="textStrikeoutToolButton"
          role="option"
        />
        <ActionButton
          title="tool.Link"
          img="icon-tool-link"
          onClick={() => dispatch(actions.openElement('linkModal'))}
          dataElement="linkButton"
          role="option"
        />
        {core.isCreateRedactionEnabled() && (
          <ActionButton
            dataElement="textRedactToolButton"
            title="option.redaction.markForRedaction"
            img="ic_annotation_add_redact_black_24px"
            onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.RedactionAnnotation)}
            role="option"
          />
        )}
      </CustomizablePopup>
    </div>
  );
};

export default withTranslation()(TextPopup);
