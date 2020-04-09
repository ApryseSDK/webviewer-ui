import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import ColorPalette from 'components/ColorPalette';
import Button from 'components/Button';

import core from 'core';
import getRichTextPopupPosition from 'helpers/getRichTextPopupPosition';
import actions from 'actions';
import selectors from 'selectors';

import './RichTextPopup.scss';

const RichTextPopup = () => {
  const [isDisabled, isOpen] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'richTextPopup'),
      selectors.isElementOpen(state, 'richTextPopup'),
    ],
    shallowEqual
  );
  const [cssPosition, setCssPosition] = useState({ left: 0, top: 0 });
  const [draggablePosition, setDraggablePosition] = useState({ x: 0, y: 0 });
  const [format, setFormat] = useState({});
  const popupRef = useRef(null);
  const editorRef = useRef(null);
  const annotationRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleSelectionChange = range => {
      if (range && editorRef.current) {
        setFormat(getFormat(range));
      }
    };

    core.addEventListener('editorSelectionChanged', handleSelectionChange);
    return () => core.removeEventListener('editorSelectionChanged', handleSelectionChange);
  }, []);

  useEffect(() => {
    const handleTextChange = () => {
      if (annotationRef.current?.isAutoSized()) {
        const position = getRichTextPopupPosition(annotationRef.current, popupRef);
        setCssPosition(position);
      }

      setFormat(getFormat(editorRef.current?.getSelection()));
    };

    core.addEventListener('editorTextChanged', handleTextChange);
    return () => core.removeEventListener('editorTextChanged', handleTextChange);
  }, []);

  useEffect(() => {
    const handleEditorFocus = (editor, annotation) => {
      if (annotation instanceof window.Annotations.FreeTextAnnotation) {
        const position = getRichTextPopupPosition(annotation, popupRef);
        setCssPosition(position);
        // when the editor is focused, we want to reset any previous drag movements so that
        // the popup will be positioned centered to the editor
        setDraggablePosition({ x: 0, y: 0 });

        editorRef.current = editor;
        annotationRef.current = annotation;

        dispatch(actions.openElements(['richTextPopup']));
      }
    };

    core.addEventListener('editorFocus', handleEditorFocus);
    return () => core.removeEventListener('editorFocus', handleEditorFocus);
  }, [dispatch]);

  useEffect(() => {
    const handleEditorBlur = () => {
      dispatch(actions.closeElements(['richTextPopup']));
      editorRef.current = null;
      annotationRef.current = null;
    };

    core.addEventListener('editorBlur', handleEditorBlur);
    return () => core.removeEventListener('editorBlur', handleEditorBlur);
  }, [dispatch]);

  const getFormat = range => {
    if (!range) {
      return {};
    }

    const format = editorRef.current.getFormat(range.index, range.length);

    if (typeof format.color === 'string') {
      format.color = new window.Annotations.Color(format.color);
    } else if (Array.isArray(format.color)) {
      // the selection contains multiple color, so we set the current color to null
      format.color = null;
    } else if (!format.color) {
      format.color = annotationRef.current.TextColor;
    }

    return format;
  };

  const handleClick = format => () => {
    const { index, length } = editorRef.current.getSelection();
    const currentFormat = editorRef.current.getFormat(index, length);

    applyFormat(format, !currentFormat[format]);
  };

  const handleColorChange = (_, color) => {
    applyFormat('color', color.toHexString());
  };

  const applyFormat = (formatKey, value) => {
    editorRef.current.format(formatKey, value);

    if (formatKey === 'color') {
      value = new window.Annotations.Color(value);
    }

    // format the entire editor doesn't trigger the editorTextChanged event, so we set the format state here
    setFormat({
      ...format,
      [formatKey]: value,
    });
  };

  const syncDraggablePosition = (e, { x, y }) => {
    setDraggablePosition({ x, y });
  };

  return isDisabled ? null : (
    <Draggable
      position={draggablePosition}
      onDrag={syncDraggablePosition}
      onStop={syncDraggablePosition}
      enableUserSelectHack={false}
      // don't allow drag when clicking on a button element or a color cell
      cancel=".Button, .cell"
      // prevent the blur event from being triggered when clicking on toolbar buttons
      // otherwise we can't style the text since a blur event is triggered before a click event
      onMouseDown={e => {
        if (e.type !== 'touchstart') {
          e.preventDefault();
        }
      }}
    >
      <div
        className={classNames({
          Popup: true,
          RichTextPopup: true,
          open: isOpen,
          closed: !isOpen,
        })}
        ref={popupRef}
        data-element="richTextPopup"
        style={{ ...cssPosition }}
      >
        <div className="rich-text-format">
          <Button
            isActive={format.bold}
            data-element="richTextBoldButton"
            onClick={handleClick('bold')}
            img="icon-text-bold"
            title="option.richText.bold"
          />
          <Button
            isActive={format.italic}
            data-element="richTextItalicButton"
            onClick={handleClick('italic')}
            img="icon-text-italic"
            title="option.richText.italic"
          />
          <Button
            isActive={format.underline}
            data-element="richTextUnderlineButton"
            onClick={handleClick('underline')}
            img="ic_annotation_underline_black_24px"
            title="option.richText.underline"
          />
          <Button
            isActive={format.strike}
            data-element="richTextStrikeButton"
            onClick={handleClick('strike')}
            img="ic_annotation_strikeout_black_24px"
            title="option.richText.strikeout"
          />
        </div>
        <ColorPalette color={format.color} property="TextColor" onStyleChange={handleColorChange} />
      </div>
    </Draggable>
  );
};

export default RichTextPopup;
