import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import ColorPicker from 'components/StylePicker/ColorPicker';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import './RichTextStyleEditor.scss';
import DataElements from 'constants/dataElement';
import TextStylePicker from 'components/TextStylePicker';
import adjustFreeTextBoundingBox from 'helpers/adjustFreeTextBoundingBox';

const propTypes = {
  annotation: PropTypes.object,
  editor: PropTypes.object,
  style: PropTypes.shape({
    TextColor: PropTypes.object,
    RichTextStyle: PropTypes.any,
  }),
  isFreeTextAutoSize: PropTypes.bool,
  onFreeTextSizeToggle: PropTypes.func,
  onPropertyChange: PropTypes.func,
  onRichTextStyleChange: PropTypes.func,
  isRedaction: PropTypes.bool,
  isRichTextEditMode: PropTypes.bool,
  setIsRichTextEditMode: PropTypes.func,
  isTextStylePickerHidden: PropTypes.bool,
};

const RichTextStyleEditor = ({
  annotation, editor,
  style,
  isFreeTextAutoSize,
  onFreeTextSizeToggle,
  onPropertyChange,
  onRichTextStyleChange,
  isRichTextEditMode,
  setIsRichTextEditMode,
  isRedaction,
  isTextStylePickerHidden,
  activeTool,
  textSizeSliderComponent,
}) => {
  const [
    fonts,
  ] = useSelector(
    (state) => [
      selectors.getFonts(state),
    ],
    shallowEqual,
  );

  const [format, setFormat] = useState({});
  const editorRef = useRef(null);
  const annotationRef = useRef(null);
  const propertiesRef = useRef({});
  const dispatch = useDispatch();
  const oldSelectionRef = useRef();
  const richTextEditModeRef = useRef();
  richTextEditModeRef.current = isRichTextEditMode;

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
      setFormat(getFormat(editorRef.current?.getSelection()));
    };
    core.addEventListener('editorSelectionChanged', handleSelectionChange);
    core.addEventListener('editorTextChanged', handleTextChange);
    // Have to disable instead of closing because annotation popup will reopen itself
    dispatch(actions.disableElements([DataElements.ANNOTATION_STYLE_POPUP]));
    return () => {
      core.removeEventListener('editorSelectionChanged', handleSelectionChange);
      core.removeEventListener('editorTextChanged', handleTextChange);
      dispatch(actions.enableElements([DataElements.ANNOTATION_STYLE_POPUP]));
    };
  }, []);

  useEffect(() => {
    editorRef.current = editor;
    annotationRef.current = annotation;
    if (isRichTextEditMode && annotation) {
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
        underline: stylesTemp?.['text-decoration']?.includes('underline')
          || stylesTemp?.['text-decoration']?.includes('word'),
        strikeout: stylesTemp?.['text-decoration']?.includes('line-through') ?? false,
        size: stylesTemp?.['font-size'],
        font: stylesTemp?.['font-family'],
        StrokeStyle,
        calculatedFontSize: annotation.getCalculatedFontSize()
      };
    }

    setFormat(getFormat(editorRef.current?.getSelection()));

    if (oldSelectionRef.current) {
      editorRef.current.setSelection(oldSelectionRef.current);
      oldSelectionRef.current = null;
    }
  }, [annotation, editor, isRichTextEditMode]);

  useEffect(() => {
    const handleEditorBlur = () => {
      editorRef.current = null;
      annotationRef.current = null;
      setIsRichTextEditMode(false);
    };
    const handleEditorFocus = () => {
      setIsRichTextEditMode(true);
    };

    core.addEventListener('editorBlur', handleEditorBlur);
    core.addEventListener('editorFocus', handleEditorFocus);
    return () => {
      core.removeEventListener('editorBlur', handleEditorBlur);
      core.removeEventListener('editorFocus', handleEditorFocus);
    };
  }, [dispatch]);


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

    const propertiesToCheck = ['font', 'size', 'originalSize'];

    for (const prop of propertiesToCheck) {
      if (format[prop] && Array.isArray(format[prop])) {
        format[prop] = undefined;
      }
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

  const handleColorChange = (name, color) => {
    if (!richTextEditModeRef.current) {
      onPropertyChange(name, color);
      return;
    }
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

  // onPropertyChange
  const handlePropertyChange = (property, value) => {
    if (!richTextEditModeRef.current) {
      onPropertyChange(property, value);
      return;
    }

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


  // onRichTextStyleChange
  const handleRichTextStyleChange = (property, value) => {
    if (!richTextEditModeRef.current) {
      onRichTextStyleChange(property, value);
      return;
    }

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
      const freeText = annotationRef.current;
      if (freeText.isAutoSized()) {
        const editBoxManager = core.getAnnotationManager().getEditBoxManager();
        editBoxManager.resizeAnnotation(freeText);
      }
    } else {
      handleTextFormatChange(propertyTranslation[property])();
    }
  };

  let properties = {};

  const { RichTextStyle } = style;
  const defaults = {
    bold: RichTextStyle?.[0]?.['font-weight'] === 'bold' ?? false,
    italic: RichTextStyle?.[0]?.['font-style'] === 'italic' ?? false,
    underline: RichTextStyle?.[0]?.['text-decoration']?.includes('underline') || RichTextStyle?.[0]?.['text-decoration']?.includes('word'),
    strikeout: RichTextStyle?.[0]?.['text-decoration']?.includes('line-through') ?? false,
    font: RichTextStyle?.[0]?.['font-family'],
    size: RichTextStyle?.[0]?.['font-size'],
    StrokeStyle: 'solid',
  };

  properties = {
    ...style,
    ...defaults,
  };

  if (isRichTextEditMode && annotation) {
    propertiesRef.current.bold = format.bold;
    propertiesRef.current.italic = format.italic;
    propertiesRef.current.underline = format.underline;
    propertiesRef.current.strikeout = format.strike;
    propertiesRef.current.quillFont = format.font || propertiesRef.current.Font;
    propertiesRef.current.quillFontSize = format.originalSize || propertiesRef.current.FontSize;
  }

  return (
    <div className="RichTextStyleEditor"
      onMouseDown={(e) => {
        if (e.type !== 'touchstart' && isRichTextEditMode) {
          e.preventDefault();
        }
      }}
    >
      {!isTextStylePickerHidden && (
        <div className="menu-items">
          <TextStylePicker
            fonts={fonts}
            onPropertyChange={handlePropertyChange}
            onRichTextStyleChange={handleRichTextStyleChange}
            properties={isRichTextEditMode ? propertiesRef.current : properties}
            stateless={true}
            isFreeText={!isRedaction}
            onFreeTextSizeToggle={onFreeTextSizeToggle}
            isFreeTextAutoSize={isFreeTextAutoSize}
            isRichTextEditMode={isRichTextEditMode}
            isRedaction={isRedaction}
          />
        </div>
      )}
      <ColorPicker
        onColorChange={(color) => {
          handleColorChange('TextColor', new window.Core.Annotations.Color(color));
        }}
        color={isRichTextEditMode ? format.color : style['TextColor']}
        activeTool={activeTool}
        type={'Text'}
      />
      {textSizeSliderComponent}
    </div>
  );
};
RichTextStyleEditor.propTypes = propTypes;

export default React.memo(RichTextStyleEditor);
