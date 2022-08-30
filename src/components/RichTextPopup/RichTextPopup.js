import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import Element from 'components/Element';
import ColorPalette from 'components/ColorPalette';
import Button from 'components/Button';
import HorizontalDivider from 'components/HorizontalDivider';
import { isMobile } from 'helpers/device';
import core from 'core';
import getRichTextPopupPosition from 'helpers/getRichTextPopupPosition';
import MathSymbolsPicker from '../MathSymbolsPicker';
import ColorPalettePicker from 'components/ColorPalettePicker';

import actions from 'actions';
import selectors from 'selectors';

import './RichTextPopup.scss';

const RichTextPopup = () => {
  const [isDisabled, isOpen, isPaletteDisabled, customColors, isInDesktopOnlyMode] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, 'richTextPopup'),
      selectors.isElementOpen(state, 'richTextPopup'),
      selectors.isElementDisabled(state, 'colorPalette'),
      selectors.getCustomColors(state, 'customColors'),
      selectors.isInDesktopOnlyMode(state)
    ],
    shallowEqual,
  );
  const [symbolsVisible, setSymbolsVisible] = useState(false);
  const [cssPosition, setCssPosition] = useState({ left: 0, top: 0 });
  const [draggablePosition, setDraggablePosition] = useState({ x: 0, y: 0 });
  const [format, setFormat] = useState({});
  const popupRef = useRef(null);
  const editorRef = useRef(null);
  const annotationRef = useRef(null);
  const dispatch = useDispatch();
  const symbolsAreaHeight = 150; // max height for the math symbols area

  useEffect(() => {
    const handleSelectionChange = (range) => {
      if (range && editorRef.current) {
        setFormat(getFormat(range));
      }
    };

    core.addEventListener('editorSelectionChanged', handleSelectionChange);
    return () => core.removeEventListener('editorSelectionChanged', handleSelectionChange);
  }, []);

  useEffect(() => {
    const handleTextChange = () => {
      if (annotationRef.current?.isAutoSized() && popupRef.current) {
        const position = getRichTextPopupPosition(
          annotationRef.current,
          popupRef,
        );
        setCssPosition(position);
      }

      setFormat(getFormat(editorRef.current?.getSelection()));
    };

    core.addEventListener('editorTextChanged', handleTextChange);
    return () => core.removeEventListener('editorTextChanged', handleTextChange);
  }, []);

  useEffect(() => {
    const handleEditorFocus = (editor, annotation) => {
      // Use setTimeout to make sure Free Text annotations have time to resize before opening popup
      setTimeout(() => {
        if (
          annotation instanceof window.Annotations.FreeTextAnnotation &&
          popupRef.current &&
          !annotation.getContentEditAnnotationId() &&
          annotation.ToolName !== window.Core.Tools.ToolNames.ADD_PARAGRAPH
        ) {
          const position = getRichTextPopupPosition(
            annotation,
            popupRef,
          );

          setCssPosition(position);
          // when the editor is focused, we want to reset any previous drag movements so that
          // the popup will be positioned centered to the editor
          setDraggablePosition({ x: 0, y: 0 });

          editorRef.current = editor;
          annotationRef.current = annotation;

          setFormat(getFormat(editorRef.current?.getSelection()));
          dispatch(actions.openElements(['richTextPopup']));
        }
      }, 0);
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

  useEffect(() => {
    if (popupRef.current && annotationRef.current) {
      const position = getRichTextPopupPosition(
        annotationRef.current,
        popupRef,
      );
      setCssPosition(position);
    }
  }, [symbolsVisible]);

  const getFormat = (range) => {
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

  const handleTextFormatChange = (format) => () => {
    const { index, length } = editorRef.current.getSelection();
    const currentFormat = editorRef.current.getFormat(index, length);

    applyFormat(format, !currentFormat[format]);
  };

  const handleSymbolsClick = () => {
    setSymbolsVisible(!symbolsVisible);
  };

  const handleColorChange = (_, color) => {
    applyFormat('color', color.toHexString());
  };

  const applyFormat = (formatKey, value) => {
    editorRef.current?.format(formatKey, value);

    if (formatKey === 'color') {
      value = new window.Annotations.Color(value);
    }

    // format the entire editor doesn't trigger the editorTextChanged event, so we set the format state here
    setFormat({
      ...format,
      [formatKey]: value
    });
  };

  const syncDraggablePosition = (e, { x, y }) => {
    setDraggablePosition({ x, y });
  };

  const insertSymbols = (symbol) => {
    const { index, length } = editorRef.current.getSelection();
    // if user selected some text, then we want to first delete the selected content
    if (length > 0) {
      editorRef.current.deleteText(index, length);
    }
    // insert symbol at the selected index
    editorRef.current.insertText(index, symbol);
    editorRef.current.setSelection(index + 1);
  };

  // TODO for now don't show it in mobile
  return isDisabled || (isMobile() && !isInDesktopOnlyMode) ? null : (
    <Draggable
      position={draggablePosition}
      onDrag={syncDraggablePosition}
      onStop={syncDraggablePosition}
      enableUserSelectHack={false}
      // don't allow drag when clicking on a button element or a color cell
      cancel=".Button, .cell, .mathSymbolsContainer"
      // prevent the blur event from being triggered when clicking on toolbar buttons
      // otherwise we can't style the text since a blur event is triggered before a click event
      onMouseDown={(e) => {
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
        <Element className="rich-text-format" dataElement="richTextFormats">
          <Button
            isActive={format.bold}
            dataElement="richTextBoldButton"
            onClick={handleTextFormatChange('bold')}
            img="icon-text-bold"
            title="option.richText.bold"
          />
          <Button
            isActive={format.italic}
            dataElement="richTextItalicButton"
            onClick={handleTextFormatChange('italic')}
            img="icon-text-italic"
            title="option.richText.italic"
          />
          <Button
            isActive={format.underline}
            dataElement="richTextUnderlineButton"
            onClick={handleTextFormatChange('underline')}
            img="ic_annotation_underline_black_24px"
            title="option.richText.underline"
          />
          <Button
            isActive={format.strike}
            dataElement="richTextStrikeButton"
            onClick={handleTextFormatChange('strike')}
            img="ic_annotation_strikeout_black_24px"
            title="option.richText.strikeout"
          />
          <Button
            dataElement="mathSymbolsButton"
            onClick={handleSymbolsClick}
            img="ic_thumbnails_grid_black_24px"
            title="option.mathSymbols"
          />
        </Element>
        <HorizontalDivider style={{ paddingTop: 0 }} />
        {!isPaletteDisabled && (
          <>
            <ColorPalette
              colorMapKey="freeText"
              color={format.color}
              property="TextColor"
              onStyleChange={handleColorChange}
              hasPadding
            />
            {customColors.length > 0 && (
              <ColorPalettePicker
                color={format.color}
                property="TextColor"
                onStyleChange={handleColorChange}
                enableEdit={false}
              />
            )}
          </>
        )}
        {symbolsVisible && <MathSymbolsPicker onClickHandler={insertSymbols} maxHeight={symbolsAreaHeight} />}
      </div>
    </Draggable>
  );
};

export default RichTextPopup;