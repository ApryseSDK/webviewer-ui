import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import DataElementWrapper from '../DataElementWrapper';
import Icon from 'components/Icon';
import TextEditingPanel from './TextEditingPanel';
import DataElements from 'constants/dataElement';

// //TODO: Implement when opacity is available from worker
// import { circleRadius } from 'constants/slider';

const fonts = [];

const TextEditingPanelContainer = () => {
  const [isOpen, isDisabled, textEditingPanelWidth, isInDesktopOnlyMode] = useSelector(
    (state) => [
      selectors.isElementOpen(state, 'textEditingPanel'),
      selectors.isElementDisabled(state, 'textEditingPanel'),
      selectors.getTextEditingPanelWidth(state),
      selectors.isInDesktopOnlyMode(state),
    ],
    shallowEqual,
  );

  const isMobile = () => window.innerWidth < 640;

  // selection modes used are 'FreeText' and 'ContentBox'
  const [selectionMode, setSelectionMode] = useState(null);

  useEffect(() => {
    const supportedFonts = window.Core.ContentEdit.getContentEditingFonts();

    supportedFonts.then((res) => res.forEach((font) => {
      if (!fonts.includes(font)) {
        fonts.push(font);
      }
    }));
  }, [selectionMode]);

  const editorRef = useRef(null);
  const annotationRef = useRef(null);

  const [selectedContentBox, setSelectedContentBox] = useState(null);

  // properties for TextStylePicker
  const [textEditProperties, setTextEditProperties] = useState({});

  // properties for custom buttons and color picker
  const [format, setFormat] = useState({});

  useEffect(() => {
    const handleSelectionChange = (range) => {
      if (range && editorRef.current && core.getContentEditManager().isInContentEditMode()) {
        setFormat(getFormat(range));
      }
    };

    core.addEventListener('editorSelectionChanged', handleSelectionChange);
    return () => core.removeEventListener('editorSelectionChanged', handleSelectionChange);
  }, []);

  useEffect(() => {
    const handleTextChange = () => {
      if (core.getContentEditManager().isInContentEditMode()) {
        setFormat(getFormat(editorRef.current?.getSelection()));
      }
    };

    core.addEventListener('editorTextChanged', handleTextChange);
    return () => core.removeEventListener('editorTextChanged', handleTextChange);
  }, []);

  useEffect(() => {
    const handleEditorFocus = (editor, annotation) => {
      if (
        annotation instanceof window.Annotations.FreeTextAnnotation &&
        core.getContentEditManager().isInContentEditMode()
      ) {
        editorRef.current = editor;
        annotationRef.current = annotation;
        setSelectionMode('FreeText');

        const richTextStyles = annotationRef.current.getRichTextStyle();

        const selectedTextEditProperties = textEditProperties;
        selectedTextEditProperties.bold = richTextStyles?.[0]['font-weight'] === 'bold' ?? false;
        selectedTextEditProperties.italic = richTextStyles?.[0]['font-style'] === 'italic' ?? false;
        selectedTextEditProperties.underline =
          richTextStyles?.[0]['text-decoration']?.includes('underline') ||
          richTextStyles?.[0]['text-decoration']?.includes('word');

        setTextEditProperties(selectedTextEditProperties);
        dispatch(actions.setContentEditor(editorRef.current));
        dispatch(actions.closeElement('annotationPopup'));
      }
    };
    core.addEventListener('editorFocus', handleEditorFocus);
    return () => core.removeEventListener('editorFocus', handleEditorFocus);
  }, []);

  useEffect(() => {
    const handleEditorBlur = () => {
      if (core.getContentEditManager().isInContentEditMode()) {
        editorRef.current = null;
        annotationRef.current = null;
        dispatch(actions.setContentEditor(null));
      }
    };

    core.addEventListener('editorBlur', handleEditorBlur);
    return () => core.removeEventListener('editorBlur', handleEditorBlur);
  }, []);

  const getFormat = (range) => {
    if (!range) {
      return {};
    }

    const format = editorRef.current.getFormat(range.index, range.length);

    if (typeof format.color === 'string') {
      format.color = new window.Annotations.Color(format.color);
    } else if (Array.isArray(format.color)) {
      // the selection contains multiple colors, so we set the current color to null
      format.color = null;
    } else if (!format.color) {
      format.color = annotationRef.current['TextColor'];
    }

    return format;
  };

  // //TODO: implement when opacity is available from worker
  // const sliderProperties = {
  //   property: 'Opacity',
  //   displayProperty: 'opacity',
  //   value: annotation.Opacity,
  //   getDisplayValue: Opacity => `${Math.round(Opacity * 100)}%`,
  //   dataElement: DataElements.OPACITY_SLIDER,
  //   getCirclePosition: (lineLength, Opacity) => Opacity * lineLength + circleRadius,
  //   convertRelativeCirclePositionToValue: circlePosition => circlePosition,
  //   withInputField: true,
  //   inputFieldType: 'number',
  //   min: 0,
  //   max: 100,
  //   step: 1,
  //   getLocalValue: opacity => parseInt(opacity) / 100,
  // };

  // const isMobile() = useMedia(
  //   // Media queries
  //   ['(max-width: 640px)'],
  //   [true],
  //   // Default value
  //   false,
  // );

  const dispatch = useDispatch();

  useEffect(() => {
    const handleContentEditModeStart = () => {
      // start with panel closed in mobile so it doesn't cover the whole screen
      if (!isInDesktopOnlyMode && isMobile()) {
        return;
      }
      dispatch(actions.closeElements(['searchPanel', 'notesPanel', 'redactionPanel', 'wv3dPropertiesPanel']));
      dispatch(actions.openElement('textEditingPanel'));
    };

    const handleContentEditModeEnd = () => {
      dispatch(actions.closeElement('textEditingPanel'));
    };

    core.addEventListener('contentEditModeStarted', handleContentEditModeStart);
    core.addEventListener('contentEditModeEnded', handleContentEditModeEnd);
    return () => {
      core.removeEventListener('contentEditModeStarted', handleContentEditModeStart);
      core.removeEventListener('contentEditModeEnded', handleContentEditModeEnd);
    };
  }, []);

  useEffect(() => {
    const handleAnnotationSelected = (annotations, action) => {
      if (!core.getContentEditManager().isInContentEditMode()) {
        return;
      }
      const annotation = annotations[0];
      const isFreeText =
        annotation instanceof window.Annotations.FreeTextAnnotation &&
        annotation.getIntent() === window.Annotations.FreeTextAnnotation.Intent.FreeText &&
        (annotation.getContentEditAnnotationId() || annotation.ToolName === window.Core.Tools.ToolNames.ADD_PARAGRAPH);
      if (action === 'selected') {
        if (!isInDesktopOnlyMode && isMobile()) {
          return;
        }
        if (isFreeText) {
          annotationRef.current = annotation;
          setSelectionMode('FreeText');
          if (!isDisabled && !isOpen) {
            dispatch(actions.toggleElement('textEditingPanel'));
          }
        } else if (annotation.isContentEditPlaceholder()) {
          setSelectedContentBox(annotation);
          setFormat(annotation.getContentEditingFormat());
          setTextEditProperties(getTextEditPropertiesFromContentEditPlaceHolder(annotation));
          setSelectionMode('ContentBox');
          editorRef.current = null;
          annotationRef.current = null;
          if (!isDisabled && !isOpen) {
            dispatch(actions.toggleElement('textEditingPanel'));
          }
        }
      } else if (action === 'deselected') {
        if (selectedContentBox !== undefined) {
          setSelectedContentBox(null);
          if (!editorRef.current && !annotationRef.current) {
            setSelectionMode(null);
          }
        }
      }
    };

    core.addEventListener('annotationSelected', handleAnnotationSelected);
    return () => {
      core.removeEventListener('annotationSelected', handleAnnotationSelected);
    };
  }, [isDisabled, isOpen]);

  useEffect(() => {
    const onResize = () => {
      if (core.getContentEditManager().isInContentEditMode()) {
        if (isMobile()) {
          dispatch(actions.closeElement('textEditingPanel'));
        } else {
          dispatch(actions.openElement('textEditingPanel'));
        }
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handlePropertyChange = (property, value) => {
    if (annotationRef.current) {
      core.setAnnotationStyles(annotationRef.current, {
        [property]: value,
      });
    } else {
      setTextEditProperties({
        ...textEditProperties,
        [property]: value,
      });
    }

    if (selectedContentBox && !editorRef.current) {
      switch (property) {
        case 'Font':
          window.Core.ContentEdit.setContentFont(selectedContentBox, value);
          break;
        case 'FontSize':
          window.Core.ContentEdit.setContentFontSize(selectedContentBox, value);
          break;
        case 'TextAlign':
          window.Core.ContentEdit.alignContents(selectedContentBox, value);
          break;
      }
    }
  };

  const handleRichTextStyleChange = (property, value) => {
    if (annotationRef.current) {
      core.updateAnnotationRichTextStyle(annotationRef.current, { [property]: value });
    } else {
      setTextEditProperties({
        ...textEditProperties,
        [property]: value,
      });
    }
  };

  const handleTextFormatChange = (format) => () => {
    if (selectedContentBox && !editorRef.current) {
      switch (format) {
        case 'bold':
          window.Core.ContentEdit.toggleBoldContents(selectedContentBox);
          break;
        case 'italic':
          window.Core.ContentEdit.toggleItalicContents(selectedContentBox);
          break;
        case 'underline':
          window.Core.ContentEdit.toggleUnderlineContents(selectedContentBox);
          break;
      }
      const contentFormat = selectedContentBox.getContentEditingFormat();
      setFormat({
        ...contentFormat,
        [format]: !contentFormat[format],
      });
      return;
    }

    if (editorRef.current) {
      const { index, length } = editorRef.current.getSelection();
      const currentFormat = editorRef.current.getFormat(index, length);
      applyFormat(format, !currentFormat[format]);
    }
  };

  const handleAddLinkToText = () => {
    if (editorRef.current) {
      dispatch(actions.openElement(DataElements.CONTENT_EDIT_LINK_MODAL));
    }
  };

  const handleColorChange = (_, color) => {
    const textColor = color.toHexString();
    if (selectedContentBox && !editorRef.current) {
      window.Core.ContentEdit.setTextColor(selectedContentBox, textColor);
    }
    applyFormat('color', color);
  };

  const applyFormat = (formatKey, value) => {
    editorRef.current?.format(formatKey, value);

    if (formatKey === 'color') {
      value = new window.Annotations.Color(value);
    }

    // format the entire editor doesn't trigger the editorTextChanged event, so we set the format state here
    setFormat({
      ...format,
      [formatKey]: value,
    });
  };
  // //TODO: implement when opacity is available from worker
  // const handleSliderChange = (property, value) => {
  //   const annotationManager = core.getAnnotationManager();

  //   annotation[property] = value;
  //   annotationManager.redrawAnnotation(annotation);
  // };

  const getTextEditPropertiesFromContentEditPlaceHolder = (annotation) => {
    const fontMap = {};

    fonts.forEach((font) => {
      const fontKey = font.replace(/\s+/g, '');
      fontMap[fontKey] = font;
    });

    const isTextContentPlaceholder = annotation.isContentEditPlaceholder() && annotation.getContentEditType() === window.Core.ContentEdit.Types.TEXT;
    if (isTextContentPlaceholder) {
      const styleProperties = annotation.getContentStyleProperties();
      if (!styleProperties) {
        return;
      }
      const { fontSize, fontFamily, textAlign } = styleProperties;
      let fontName = fontMap[fontFamily.replace(/\s+/g, '')];

      // hack to use placeholder in font dropdown needs to have a non-empty, not included value
      if (!fontName) {
        fontName = 'Font';
      }

      return {
        Font: fontName,
        FontSize: fontSize,
        TextAlign: textAlign,
      };
    }
  };

  const closeTextEditingPanel = () => {
    dispatch(actions.closeElement('textEditingPanel'));
  };

  const renderMobileCloseButton = () => {
    return (
      <div className="close-container">
        <div className="close-icon-container" onClick={closeTextEditingPanel}>
          <Icon glyph="ic_close_black_24px" className="close-icon" />
        </div>
      </div>
    );
  };

  const style =
    !isInDesktopOnlyMode && isMobile()
      ? {}
      : { width: `${textEditingPanelWidth}px`, minWidth: `${textEditingPanelWidth}px` };

  if (isDisabled || !isOpen) {
    return null;
  }
  return (
    <DataElementWrapper dataElement="textEditingPanel" className="Panel TextEditingPanel" style={style}>
      {!isInDesktopOnlyMode && isMobile() && renderMobileCloseButton()}
      <TextEditingPanel
        // sliderProperties={sliderProperties}
        // handleSliderChange={handleSliderChange}
        freeTextMode={selectionMode === 'FreeText'}
        contentSelectMode={selectionMode === 'ContentBox'}
        textEditProperties={textEditProperties}
        handlePropertyChange={handlePropertyChange}
        handleRichTextStyleChange={handleRichTextStyleChange}
        format={format}
        handleTextFormatChange={handleTextFormatChange}
        handleColorChange={handleColorChange}
        fonts={fonts}
        handleAddLinkToText={handleAddLinkToText}
        disableLinkButton={
          !editorRef.current || annotationRef.current?.ToolName === window.Core.Tools.ToolNames.ADD_PARAGRAPH
        }
      />
    </DataElementWrapper>
  );
};

export default TextEditingPanelContainer;
