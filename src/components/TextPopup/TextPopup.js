import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
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

import './TextPopup.scss';

const TextPopup = () => {
  const [isDisabled, isOpen] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'textPopup'),
      selectors.isElementOpen(state, 'textPopup'),
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
      if (popupRef.current) {
        setPosition(getTextPopupPositionBasedOn(allQuads, popupRef));
        dispatch(actions.openElement('textPopup'));
      }
    };

    textSelectTool.on('selectionComplete', onSelectionComplete);
    return () => textSelectTool.on('selectionComplete', onSelectionComplete);
  }, [dispatch]);

  const dataElementButtonMap = {
    copyTextButton: overrides => (
      <ActionButton
        title="action.copy"
        img="ic_copy_black_24px"
        onClick={copyText}
        {...overrides}
        dataElement="copyTextButton"
      />
    ),
    textHighlightToolButton: overrides => (
      <ActionButton
        title="annotation.highlight"
        img="ic_annotation_highlight_black_24px"
        onClick={() =>
          createTextAnnotationAndSelect(
            dispatch,
            Annotations.TextHighlightAnnotation,
          )
        }
        {...overrides}
        dataElement="textHighlightToolButton"
      />
    ),
    textUnderlineToolButton: overrides => (
      <ActionButton
        title="annotation.underline"
        img="ic_annotation_underline_black_24px"
        onClick={() =>
          createTextAnnotationAndSelect(
            dispatch,
            Annotations.TextUnderlineAnnotation,
          )
        }
        {...overrides}
        dataElement="textUnderlineToolButton"
      />
    ),
    textSquigglyToolButton: overrides => (
      <ActionButton
        title="annotation.squiggly"
        img="ic_annotation_squiggly_black_24px"
        onClick={() =>
          createTextAnnotationAndSelect(
            dispatch,
            Annotations.TextSquigglyAnnotation,
          )
        }
        {...overrides}
        dataElement="textSquigglyToolButton"
      />
    ),
    textStrikeoutToolButton: overrides => (
      <ActionButton
        title="annotation.strikeout"
        img="ic_annotation_strikeout_black_24px"
        onClick={() =>
          createTextAnnotationAndSelect(
            dispatch,
            Annotations.TextStrikeoutAnnotation,
          )
        }
        {...overrides}
        dataElement="textStrikeoutToolButton"
      />
    ),
    textRedactToolButton: overrides =>
      core.isCreateRedactionEnabled() && (
        <ActionButton
          title="option.redaction.markForRedaction"
          img="ic_annotation_add_redact_black_24px"
          onClick={() =>
            createTextAnnotationAndSelect(
              dispatch,
              Annotations.RedactionAnnotation,
            )
          }
          {...overrides}
          dataElement="textRedactToolButton"
        />
      ),
  };

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
      onClick={() => dispatch(actions.closeElement('textPopup'))}
    >
      <CustomizablePopup dataElement="textPopup">
        {dataElementButtonMap}
      </CustomizablePopup>
    </div>
  );
};

export default TextPopup;
