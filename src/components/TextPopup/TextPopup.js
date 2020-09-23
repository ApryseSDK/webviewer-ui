import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import getHashParams from 'helpers/getHashParams';

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

const TextPopup = () => {
  const fullAPI = !!getHashParams('pdfnet', false);

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

    textSelectTool.on('selectionComplete', onSelectionComplete);
    return () => textSelectTool.off('selectionComplete', onSelectionComplete);
  }, [dispatch, popupItems]);

  const onClose = useCallback(() => dispatch(actions.closeElement('textPopup')), [dispatch]);
  useArrowFocus(!isDisabled && isOpen, onClose, popupRef);

  const textEditingHandler = useCallback(() => {
    dispatch(actions.openElement('editTextModal'));
  }, [dispatch]);

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
    >
      <CustomizablePopup dataElement="textPopup">
        {fullAPI && (
          <ActionButton
            dataElement="editTextButton"
            title="action.edit"
            img="ic_edit_black_24px"
            onClick={textEditingHandler}
          />
        )}
        <ActionButton dataElement="copyTextButton" title="action.copy" img="ic_copy_black_24px" onClick={copyText} />
        <ActionButton
          dataElement="textHighlightToolButton"
          title="annotation.highlight"
          img="icon-tool-highlight"
          onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.TextHighlightAnnotation)}
        />
        <ActionButton
          dataElement="textUnderlineToolButton"
          title="annotation.underline"
          img="icon-tool-text-manipulation-underline"
          onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.TextUnderlineAnnotation)}
        />
        <ActionButton
          dataElement="textSquigglyToolButton"
          title="annotation.squiggly"
          img="icon-tool-text-manipulation-squiggly"
          onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.TextSquigglyAnnotation)}
        />
        <ActionButton
          title="annotation.strikeout"
          img="icon-tool-text-manipulation-strikethrough"
          onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.TextStrikeoutAnnotation)}
          dataElement="textStrikeoutToolButton"
        />
        <ActionButton
          title="tool.Link"
          img="icon-tool-link"
          onClick={() => dispatch(actions.openElement('linkModal'))}
          dataElement="linkButton"
        />
        {core.isCreateRedactionEnabled() && (
          <ActionButton
            dataElement="textRedactToolButton"
            title="option.redaction.markForRedaction"
            img="ic_annotation_add_redact_black_24px"
            onClick={() => createTextAnnotationAndSelect(dispatch, Annotations.RedactionAnnotation)}
          />
        )}
      </CustomizablePopup>
    </div>
  );
};

export default TextPopup;
