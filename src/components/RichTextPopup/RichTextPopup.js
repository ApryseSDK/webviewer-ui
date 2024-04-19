import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Draggable from 'react-draggable';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import Element from 'components/Element';
import ColorPalette from 'components/ColorPalette';
import Button from 'components/Button';
import HorizontalDivider from 'components/HorizontalDivider';
import { isMobile } from 'helpers/device';
import core from 'core';
import getRichTextPopupPosition from 'helpers/getRichTextPopupPosition';
import adjustFreeTextBoundingBox from 'helpers/adjustFreeTextBoundingBox';
import MathSymbolsPicker from '../MathSymbolsPicker';
import ColorPalettePicker from 'components/ColorPalettePicker';

import actions from 'actions';
import selectors from 'selectors';

import './RichTextPopup.scss';
import DataElements from 'constants/dataElement';
import i18next from 'i18next';
import Icon from 'components/Icon';
import TextStylePicker from 'components/TextStylePicker';
import handleFreeTextAutoSizeToggle from 'src/helpers/handleFreeTextAutoSizeToggle';

const propTypes = {
  annotation: PropTypes.object,
  editor: PropTypes.object,
};

const RichTextPopup = ({ annotation, editor }) => {
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
      selectors.isElementDisabled(state, DataElements.RICH_TEXT_POPUP),
      selectors.isElementOpen(state, DataElements.RICH_TEXT_POPUP),
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
  const [isAutoSizeFont, setAutoSizeFont] = useState(annotation.isAutoSizeFont());

  useEffect(() => {
    // Have to disable instead of closing because annotation popup will reopen itself
    dispatch(actions.disableElements([DataElements.ANNOTATION_STYLE_POPUP]));
    dispatch(actions.closeElement(DataElements.ANNOTATION_POPUP));
    return () => {
      dispatch(actions.enableElements([DataElements.ANNOTATION_STYLE_POPUP]));
    };
  }, []);

  useEffect(() => {
    const handleSelectionChange = (range, oldRange) => {
      const shouldRestoreLostSelection = !range && oldRange && editorRef.current;
      if (shouldRestoreLostSelection) {
        editorRef.current.setSelection(oldRange.index, oldRange.length);
      }
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
    const stylesTemp = richTextStyles[0];
    propertiesRef.current = {
      Font: annotation.Font,
      FontSize: annotation.FontSize,
      TextAlign: annotation.TextAlign,
      TextVerticalAlign: annotation.TextVerticalAlign,
      bold: stylesTemp?.['font-weight'] === 'bold' ?? false,
      italic: stylesTemp?.['font-style'] === 'italic' ?? false,
      underline: stylesTemp?.['text-decoration']?.includes('underline') || stylesTemp?.['text-decoration']?.includes('word'),
      strikeout: stylesTemp?.['text-decoration']?.includes('line-through') ?? false,
      size: stylesTemp?.['font-size'],
      font: stylesTemp?.['font-family'],
      StrokeStyle,
      calculatedFontSize: annotation.getCalculatedFontSize()
    };

    setFormat(getFormat(editorRef.current?.getSelection()));

    if (oldSelectionRef.current) {
      editorRef.current.setSelection(oldSelectionRef.current);
      oldSelectionRef.current = null;
    }
  }, [annotation, editor]);

  useEffect(() => {
    const handleEditorBlur = () => {
      dispatch(actions.closeElements([DataElements.RICH_TEXT_POPUP]));
      editorRef.current = null;
      annotationRef.current = null;
    };
    core.addEventListener('editorBlur', handleEditorBlur);
    return () => {
      core.removeEventListener('editorBlur', handleEditorBlur);
    };
  }, [dispatch]);

  const setPopupPosition = () => {
    if (popupRef.current) {
      const position = getRichTextPopupPosition(
        annotation,
        popupRef,
      );
      setCssPosition(position);
    }
  };

  useLayoutEffect(() => {
    setPopupPosition();
  }, [annotation]);

  // useLayoutEffect so the popup can adjust position smoothly without flashing
  useLayoutEffect(() => {
    const setPosition = debounce(() => {
      if (popupRef.current) {
        setPopupPosition();
      }
    }, 100);

    const scrollViewElement = core.getDocumentViewer().getScrollViewElement();
    scrollViewElement?.addEventListener('scroll', setPosition);

    return () => scrollViewElement?.removeEventListener('scroll', setPosition);

    // The popup position should be updated when the math symbols are visible or hidden
  }, [annotation, symbolsVisible]);

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
    if (formatKey === 'size') {
      editorRef.current?.format('applyCustomFontSize', value);
    } else {
      editorRef.current?.format(formatKey, value);
    }

    if (formatKey === 'color') {
      value = new window.Core.Annotations.Color(value);
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
    if (property === 'FontSize' || property === 'Font') {
      adjustFreeTextBoundingBox(annotation);
    }
    setTimeout(() => {
      oldSelectionRef.current = { index, length };
      const editBoxManager = core.getAnnotationManager().getEditBoxManager();
      editBoxManager.focusBox(annotation);
    }, 0);
  };

  const onRichTextStyleChange = (property, value) => {
    const propertyTranslation = {
      'font-weight': 'bold',
      'font-style': 'italic',
      'underline': 'underline',
      'line-through': 'strike',
      'font-family': 'font',
      'font-size': 'size',
    };
    if (property === 'font-family' || property === 'font-size') {
      applyFormat(propertyTranslation[property], value);
      const annotation = annotationRef.current;
      if (annotation.isAutoSized()) {
        const editBoxManager = core.getAnnotationManager().getEditBoxManager();
        editBoxManager.resizeAnnotation(annotation);
      }
    } else {
      handleTextFormatChange(propertyTranslation[property])();
    }
  };


  propertiesRef.current.bold = format.bold;
  propertiesRef.current.italic = format.italic;
  propertiesRef.current.underline = format.underline;
  propertiesRef.current.strikeout = format.strike;
  propertiesRef.current.quillFont = format.font || propertiesRef.current.Font;
  propertiesRef.current.quillFontSize = format.originalSize || propertiesRef.current.FontSize;

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
        data-element={DataElements.RICH_TEXT_POPUP}
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
            <HorizontalDivider style={{ paddingTop: 0 }} />
          </>) :
            (<>
              <div className="collapsible-menu" onClick={openTextStyle} onTouchStart={openTextStyle} role={'toolbar'}>
                <div className="menu-title">
                  {i18next.t('option.stylePopup.textStyle')}
                </div>
                <Icon glyph={`icon-chevron-${isTextStylePickerOpen ? 'up' : 'down'}`} />
              </div>
              {isTextStylePickerOpen && (
                <div className="menu-items">
                  <TextStylePicker
                    fonts={fonts}
                    onPropertyChange={onPropertyChange}
                    onRichTextStyleChange={onRichTextStyleChange}
                    properties={propertiesRef.current}
                    stateless={true}
                    isFreeText={true}
                    onFreeTextSizeToggle={() => handleFreeTextAutoSizeToggle(annotation, setAutoSizeFont, isAutoSizeFont)}
                    isFreeTextAutoSize={isAutoSizeFont}
                    isRichTextEditMode={true}
                  />
                </div>
              )}
              <div className="divider" />
              {!isPaletteDisabled &&
                <div className="collapsible-menu" onClick={openColors} onTouchStart={openColors} role={'toolbar'}>
                  <div className="menu-title">
                    {i18next.t('option.stylePopup.colors')}
                  </div>
                  <Icon glyph={`icon-chevron-${isColorPickerOpen ? 'up' : 'down'}`} />
                </div>
              }
            </>
            )}
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
        {symbolsVisible && <MathSymbolsPicker onClickHandler={insertSymbols} maxHeight={symbolsAreaHeight} />}
      </div>
    </Draggable>
  );
};

RichTextPopup.propTypes = propTypes;

export default React.memo(RichTextPopup);
