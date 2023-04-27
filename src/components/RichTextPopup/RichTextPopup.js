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
import DataElements from 'constants/dataElement';
import i18next from 'i18next';
import Icon from 'components/Icon';
import TextStylePicker from 'components/TextStylePicker';

const RichTextPopup = () => {
  const [
    isDisabled,
    isOpen,
    isPaletteDisabled,
    customColors,
    isInDesktopOnlyMode,
    isTextStylePickerOpen,
    isColorPickerOpen,
    fonts,
    legacyPopup,
  ] = useSelector(
    (state) => [
      selectors.isElementDisabled(state, 'richTextPopup'),
      selectors.isElementOpen(state, 'richTextPopup'),
      selectors.isElementDisabled(state, 'colorPalette'),
      selectors.getCustomColors(state, 'customColors'),
      selectors.isInDesktopOnlyMode(state),
      selectors.isElementOpen(state, DataElements.STYLE_POPUP_TEXT_STYLE_CONTAINER),
      selectors.isElementOpen(state, DataElements.STYLE_POPUP_COLORS_CONTAINER),
      selectors.getFonts(state),
      !selectors.isElementDisabled(state, DataElements.LEGACY_RICH_TEXT_POPUP),
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
  const propertiesRef = useRef({});
  const dispatch = useDispatch();
  const oldSelectionRef = useRef();
  const symbolsAreaHeight = 150; // max height for the math symbols area

  useEffect(() => {
    const handleSelectionChange = (range) => {
      if (range && editorRef.current) {
        setFormat(getFormat(range));
      }
    };
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
    core.addEventListener('editorSelectionChanged', handleSelectionChange);
    core.addEventListener('editorTextChanged', handleTextChange);
    return () => {
      core.removeEventListener('editorSelectionChanged', handleSelectionChange);
      core.removeEventListener('editorTextChanged', handleTextChange);
    };
  }, []);

  useEffect(() => {
    const handleEditorFocus = (editor, annotation) => {
      // Use setTimeout to make sure Free Text annotations have time to resize before opening popup
      setTimeout(() => {
        if (
          annotation instanceof window.Core.Annotations.FreeTextAnnotation &&
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
          let StrokeStyle = 'solid';
          try {
            StrokeStyle = (annotation['Style'] === 'dash')
              ? `${annotation['Style']},${annotation['Dashes']}`
              : annotation['Style'];
          } catch (err) {
            console.error(err);
          }
          const richTextStyles = annotation.getRichTextStyle();
          propertiesRef.current = {
            Font: annotation.Font,
            FontSize: annotation.FontSize,
            TextAlign: annotation.TextAlign,
            TextVerticalAlign: annotation.TextVerticalAlign,
            bold: richTextStyles?.[0]?.['font-weight'] === 'bold' ?? false,
            italic: richTextStyles?.[0]?.['font-style'] === 'italic' ?? false,
            underline: richTextStyles?.[0]?.['text-decoration']?.includes('underline') || richTextStyles?.[0]?.['text-decoration']?.includes('word'),
            strikeout: richTextStyles?.[0]?.['text-decoration']?.includes('line-through') ?? false,
            StrokeStyle,
          };

          setFormat(getFormat(editorRef.current?.getSelection()));

          if (oldSelectionRef.current) {
            editorRef.current.setSelection(oldSelectionRef.current);
            oldSelectionRef.current = null;
          }

          dispatch(actions.openElements(['richTextPopup']));
        }
      }, 0);
    };
    const handleEditorBlur = () => {
      dispatch(actions.closeElements(['richTextPopup']));
      editorRef.current = null;
      annotationRef.current = null;
    };
    core.addEventListener('editorBlur', handleEditorBlur);
    core.addEventListener('editorFocus', handleEditorFocus);
    return () => {
      core.removeEventListener('editorBlur', handleEditorBlur);
      core.removeEventListener('editorFocus', handleEditorFocus);
    };
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

  useEffect(() => {
    // Have to disable instead of closing because annotation popup will reopen itself
    if (isOpen) {
      dispatch(actions.disableElements([DataElements.ANNOTATION_STYLE_POPUP]));
    } else {
      dispatch(actions.enableElements([DataElements.ANNOTATION_STYLE_POPUP]));
    }
  }, [isOpen, dispatch]);

  const getFormat = (range) => {
    if (!range) {
      return {};
    }

    const format = editorRef.current.getFormat(range.index, range.length);

    if (typeof format.color === 'string') {
      format.color = new window.Core.Annotations.Color(format.color);
    } else if (Array.isArray(format.color)) {
      // the selection contains multiple color, so we set the current color to the last selected color
      const lastSelectedColor = new window.Core.Annotations.Color(format.color[format.color.length - 1]);
      format.color = lastSelectedColor;
    } else if (!format.color) {
      format.color = annotationRef.current.TextColor;
    }

    return format;
  };

  const handleTextFormatChange = (format) => () => {
    let { index, length } = editorRef.current.getSelection();
    if (length === 0) {
      oldSelectionRef.current = { index, length };
      editorRef.current.selectAll();
      const newSelection = editorRef.current.getSelection();
      index = newSelection.index;
      length = newSelection.length;
    }
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
      value = new window.Core.Annotations.Color(value);
    }

    // format the entire editor doesn't trigger the editorTextChanged event, so we set the format state here
    setFormat({
      ...format,
      [formatKey]: value
    });

    if (oldSelectionRef.current !== null) {
      editorRef.current.setSelection(oldSelectionRef.current, 0);
      oldSelectionRef.current = null;
    }
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

  const menuItems = {
    [DataElements.STYLE_POPUP_TEXT_STYLE_CONTAINER]: isTextStylePickerOpen,
    [DataElements.STYLE_POPUP_COLORS_CONTAINER]: isColorPickerOpen,
  };
  const toggleMenuItem = (dataElement) => {
    if (!menuItems[dataElement]) {
      dispatch(actions.openElement(dataElement));
    } else {
      dispatch(actions.closeElement(dataElement));
    }
  };
  const openTextStyle = () => toggleMenuItem(DataElements.STYLE_POPUP_TEXT_STYLE_CONTAINER);
  const openColors = () => toggleMenuItem(DataElements.STYLE_POPUP_COLORS_CONTAINER);

  const onPropertyChange = (property, value) => {
    const { index, length } = editorRef.current.getSelection();
    const annotation = annotationRef.current;
    annotation[property] = value;
    editorRef.current.blur();
    setTimeout(() => {
      oldSelectionRef.current = { index, length };
      const editBoxManager = core.getAnnotationManager().getEditBoxManager();
      editBoxManager.focusBox(annotation);
    }, 0);
  };

  const onRichTextStyleChange = (property) => {
    const propertyTranslation = {
      'font-weight': 'bold',
      'font-style': 'italic',
      'underline': 'underline',
      'line-through': 'strike',
    };
    handleTextFormatChange(propertyTranslation[property])();
  };

  propertiesRef.current.bold = format.bold;
  propertiesRef.current.italic = format.italic;
  propertiesRef.current.underline = format.underline;
  propertiesRef.current.strikeout = format.strike;

  // TODO for now don't show it in mobile
  return isDisabled || (isMobile() && !isInDesktopOnlyMode) ? null : (
    <Draggable
      position={draggablePosition}
      onDrag={syncDraggablePosition}
      onStop={syncDraggablePosition}
      enableUserSelectHack={false}
      // don't allow drag when clicking on a button element or a color cell
      cancel=".Button, .cell, .mathSymbolsContainer, .Dropdown, .Dropdown__item"
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
          legacy: legacyPopup,
        })}
        ref={popupRef}
        data-element="richTextPopup"
        style={{ ...cssPosition }}
      >
        {
          legacyPopup ? (<>
            <Element className="rich-text-format-legacy" dataElement="richTextFormats">
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
            <HorizontalDivider style={{ paddingTop: 0 }}/>
          </>) :
            (<>
              <div className="collapsible-menu" onClick={openTextStyle} onTouchStart={openTextStyle} role={'toolbar'}>
                <div className="menu-title">
                  {i18next.t('option.stylePopup.textStyle')}
                </div>
                <Icon glyph={`icon-chevron-${isTextStylePickerOpen ? 'up' : 'down'}`}/>
              </div>
              {isTextStylePickerOpen && (
                <div className="menu-items">
                  <TextStylePicker
                    fonts={fonts}
                    onPropertyChange={onPropertyChange}
                    onRichTextStyleChange={onRichTextStyleChange}
                    properties={propertiesRef.current}
                    stateless={true}
                  />
                </div>
              )}
              <div className="divider"/>
              {!isPaletteDisabled &&
                <div className="collapsible-menu" onClick={openColors} onTouchStart={openColors} role={'toolbar'}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.colors')}
                  </div>
                  <Icon glyph={`icon-chevron-${isColorPickerOpen ? 'up' : 'down'}`}/>
                </div>
              }
            </>)
        }
        {!isPaletteDisabled && (legacyPopup || isColorPickerOpen) && (
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
        {symbolsVisible && <MathSymbolsPicker onClickHandler={insertSymbols} maxHeight={symbolsAreaHeight}/>}
      </div>
    </Draggable>
  );
};

export default RichTextPopup;
