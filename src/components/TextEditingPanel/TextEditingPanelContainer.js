import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import useCore from 'hooks/useCore';
import DataElementWrapper from '../DataElementWrapper';
import Icon from 'components/Icon';
import TextEditingPanel from './TextEditingPanel';
import DataElements from 'constants/dataElement';
import { COLOR_PALETTE_STYLES } from 'src/constants/commonColors';
import useDidUpdate from 'hooks/useDidUpdate';
import { isMobileSize } from 'helpers/getDeviceSize';
import useOnContentEditHistoryUndoRedoChanged from 'hooks/useOnContentEditHistoryUndoRedoChanged';
import { COMMON_COLORS } from 'constants/commonColors';
import { getInstanceNode }  from 'src/helpers/getRootNode';
import handleSelectionChange from './TextEditingPanelHelpers/handleSelectionChange';
import updateContentEditingFonts from './TextEditingPanelHelpers/updateContentEditingFonts';
import applyPropertyChange from './TextEditingPanelHelpers/applyPropertyChange';
import { css } from '@emotion/react';

const hasContentBoxEditorLinkApi = (candidate) => (
  Boolean(candidate)
  && typeof candidate.insertHyperlink === 'function'
);

const resolveContentBoxEditorFromPayload = (payload) => {
  if (hasContentBoxEditorLinkApi(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  for (const value of Object.values(payload)) {
    if (hasContentBoxEditorLinkApi(value)) {
      return value;
    }

    if (value && typeof value.getEditor === 'function') {
      const nestedEditor = value.getEditor();
      if (hasContentBoxEditorLinkApi(nestedEditor)) {
        return nestedEditor;
      }
    }
  }

  return null;
};

const TextEditingPanelContainer = ({ dataElement = 'textEditingPanel' }) => {
  const { core } = useCore();
  const [isOpen, isDisabled, textEditingPanelWidth, isInDesktopOnlyMode] = useSelector(
    (state) => [
      selectors.isElementOpen(state, dataElement),
      selectors.isElementDisabled(state, dataElement),
      selectors.getTextEditingPanelWidth(state),
      selectors.isInDesktopOnlyMode(state),
    ],
    shallowEqual,
  );

  const customColors = useSelector((state) => selectors.getCustomColors(state, COLOR_PALETTE_STYLES.TextColor.type));
  const undoRedoProperties = useOnContentEditHistoryUndoRedoChanged();
  const isMobile = isMobileSize();
  const dispatch = useDispatch();
  const instance = getInstanceNode().instance;

  // selection modes used are 'object' and 'text'
  const [selectionMode, setSelectionMode] = useState(null);
  const [fonts, setFonts] = useState([]);

  const annotationRef = useRef(null);
  const contentEditorRef = useRef(null);
  const [selectedContentBox, setSelectedContentBox] = useState(null);
  const [textEditProperties, setTextEditProperties] = useState({});
  const [format, setFormat] = useState({});
  const DEFAULT_COLOR = new instance.Core.Annotations.Color(COMMON_COLORS['black']);

  useDidUpdate(async () => {
    const isInContentEditMode = core.getContentEditManager().isInContentEditMode();
    if (!isInContentEditMode) {
      return;
    }

    await updateContentEditingFonts({ instance, setFonts });
  }, [selectionMode]);

  useEffect(() => {
    const handleSelectionChangeWrapper = async () => {
      const isInContentEditMode = contentEditorRef.current && core.getContentEditManager().isInContentEditMode();
      await handleSelectionChange({
        getFontName,
        setFonts,
        handleColorChange,
        setTextEditProperties,
        setFormat,
        setSelectionMode,
        contentEditorRef,
        isInContentEditMode,
        fonts,
        instance,
      });
    };
    core.addEventListener('contentEditSelectionChange', handleSelectionChangeWrapper);
    return () => core.removeEventListener('contentEditSelectionChange', handleSelectionChangeWrapper);
  }, [fonts]);

  /**
   * @ignore
   * Small routine that strips out the bold and italic from the font name, separates the Font into separate words for the UI
   * @param {string} fontString
   * @returns {string} the separated font name
   */
  function getFontName(fontString) {
    if (typeof fontString !== 'string') {
      return '';
    }
    const cleanedFontString = fontString.replace(/(Bold|Italic)/gi, '').trim();
    const words = [];
    let currentWord = '';

    for (const char of cleanedFontString) {
      if (char.toUpperCase() === char) {
        if (currentWord) {
          words.push(currentWord.trim());
        }
        currentWord = char;
      } else {
        currentWord += char;
      }
    }

    if (currentWord) {
      words.push(currentWord.trim());
    }

    const separatedFontName = words.join(' ');

    return separatedFontName || fontString;
  }

  useEffect(() => {
    const handleEditorStarted = (payload) => {
      const editor = resolveContentBoxEditorFromPayload(payload);
      contentEditorRef.current = editor;
      dispatch(actions.setContentBoxEditor(editor));
    };
    core.addEventListener('contentBoxEditStarted', handleEditorStarted);
    return () => core.removeEventListener('contentBoxEditStarted', handleEditorStarted);
  }, []);

  useEffect(() => {
    const handleEditorEnd = () => {
      if (core.getContentEditManager().isInContentEditMode()) {
        contentEditorRef.current = null;
        dispatch(actions.setContentBoxEditor(null));
      }
    };

    core.addEventListener('contentBoxEditEnded', handleEditorEnd);
    return () => core.removeEventListener('contentBoxEditEnded', handleEditorEnd);
  }, []);

  useEffect(() => {
    const handleContentEditModeStart = () => {
      dispatch(actions.closeElements(['searchPanel', 'notesPanel', 'redactionPanel']));
    };

    const handleContentEditModeEnd = () => {
      dispatch(actions.closeElement(dataElement));
    };

    core.addEventListener('contentEditModeStarted', handleContentEditModeStart);
    core.addEventListener('contentEditModeEnded', handleContentEditModeEnd);
    return () => {
      core.removeEventListener('contentEditModeStarted', handleContentEditModeStart);
      core.removeEventListener('contentEditModeEnded', handleContentEditModeEnd);
    };
  }, []);

  async function setContentEditPanelProperties(annotation) {
    setSelectedContentBox(annotation);
    // Editor to Editor focus causes
    // getTextEditPropertiesFromContentEditPlaceHolder to hang
    // no errors are thrown, fix in v4.
    const textAttributes = await getTextEditPropertiesFromContentEditPlaceHolder(annotation);
    setFormat(textAttributes);
    setTextEditProperties(textAttributes);
    setSelectionMode(annotation.getContentEditType());
    annotationRef.current = null;
    if (!isDisabled && !isOpen) {
      dispatch(actions.toggleElement(dataElement));
    }
  }

  useEffect(() => {
    const handleAnnotationSelected = (annotations, action) => {
      if (!core.getContentEditManager().isInContentEditMode()) {
        return;
      }
      const annotation = annotations[0];
      if (action === 'selected') {
        if (annotation.isContentEditPlaceholder()) {
          setContentEditPanelProperties(annotation);
        }
      } else if (action === 'deselected') {
        if (selectedContentBox !== undefined) {
          setSelectedContentBox(null);
          if (!annotationRef.current) {
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
    // Undo/redo doesn't reselect the annotation, so when there is no active content box editor
    // session the panel must re-fetch the selected annotation's attributes itself.
    const handleUndoRedoStatusChanged = () => {
      if (!contentEditorRef.current && selectedContentBox && core.getContentEditManager().isInContentEditMode()) {
        setContentEditPanelProperties(selectedContentBox);
      }
    };

    instance.Core.ContentEdit.addEventListener('undoRedoStatusChanged', handleUndoRedoStatusChanged);
    return () => {
      instance.Core.ContentEdit.removeEventListener('undoRedoStatusChanged', handleUndoRedoStatusChanged);
    };
  }, [selectedContentBox, isDisabled, isOpen]);

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

    applyPropertyChange({ instance, selectedContentBox, property, value });

    if (property === 'TextAlign') {
      property = 'textAlign';
      setFormat((format) => ({
        ...format,
        [property]: value
      }));
    }
  };

  const handleTextFormatChange = (updatedDecorator) => () => {
    if (selectedContentBox) {
      switch (updatedDecorator) {
        case 'bold':
          instance.Core.ContentEdit.toggleBoldContents(selectedContentBox);
          break;
        case 'italic':
          instance.Core.ContentEdit.toggleItalicContents(selectedContentBox);
          break;
        case 'underline':
          instance.Core.ContentEdit.toggleUnderlineContents(selectedContentBox);
          break;
        case 'strike':
          instance.Core.ContentEdit.toggleStrikeContents(selectedContentBox);
          break;
      }

      setFormat((format) => ({
        ...format,
        [updatedDecorator]: !format[updatedDecorator]
      }));
    }
  };

  const handleAddLinkToText = async () => {
    if (contentEditorRef.current) {
      dispatch(actions.openElement(DataElements.LINK_MODAL));
    }
  };

  const handlePrepareAddLinkToText = async (e) => {
    if (e?.type !== 'touchstart') {
      e?.preventDefault();
    }

    if (contentEditorRef.current?.prepareHyperLinkSelection) {
      await contentEditorRef.current.prepareHyperLinkSelection();
      return;
    }

    if (contentEditorRef.current?.loadHyperLinkURL) {
      await contentEditorRef.current.loadHyperLinkURL();
    }
  };

  const handleColorChange = async (_, color) => {
    const selection = window.getSelection();
    const textColor = color?.toHexString?.() || color;

    if (selectedContentBox) {
      const selectionLength = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const isParagraphEdit = selectionLength && contentEditorRef.current;
      if (isParagraphEdit) {
        const selection = contentEditorRef.current.getCurrentSelection();
        const lastKnownSelection = contentEditorRef.current.getLastKnownSelection?.();
        const activeSelection = (selection.endIndex - selection.startIndex) > 0 ? selection : lastKnownSelection;
        const isValidSelection = activeSelection && (activeSelection.endIndex - activeSelection.startIndex) > 0;
        if (isValidSelection) {
          instance.Core.ContentEdit.setTextColor(selectedContentBox, textColor);
        } else {
          instance.Core.ContentEdit.setTextAttributes({ 'fontColor': textColor });
        }
      } else {
        instance.Core.ContentEdit.setTextColor(selectedContentBox, textColor);
      }
    }
    applyFormat('color', textColor);
  };

  const handleAddActiveColor = () => {
    if (rgbColor?.toHexString) {
      const arrayOfColors = new Set([...customColors, rgbColor.toHexString().toLowerCase()]);
      dispatch(actions.setCustomColors(COLOR_PALETTE_STYLES.TextColor.type, [...arrayOfColors]));
    }
  };

  const handleZOrderChange = (direction) => {
    if (selectedContentBox) {
      const editManager = core.getDocumentViewer().getContentEditManager();
      switch (direction) {
        case 'bringToFront':
          editManager.sendToFront(selectedContentBox.getCustomData('contentEditBoxId'));
          break;
        case 'sendToBack':
          editManager.sendToBack(selectedContentBox.getCustomData('contentEditBoxId'));
          break;
        case 'bringForward':
          editManager.bringForward(selectedContentBox.getCustomData('contentEditBoxId'));
          break;
        case 'sendBackward':
          editManager.bringBackward(selectedContentBox.getCustomData('contentEditBoxId'));
          break;
        default:
          break;
      }
    }
  };

  const applyFormat = (formatKey, value) => {
    if (formatKey === 'color') {
      value = new instance.Core.Annotations.Color(value);
    }

    // format the entire editor doesn't trigger the editorTextChanged event, so we set the format state here
    setFormat({
      ...format,
      [formatKey]: value,
    });
  };

  const getTextEditPropertiesFromContentEditPlaceHolder = async (annotation) => {
    const fontMap = {};

    fonts.forEach((font) => {
      const fontKey = font.replace(/\s+/g, '');
      fontMap[fontKey] = font;
    });

    const isTextContentPlaceholder = annotation.isContentEditPlaceholder() && annotation.getContentEditType() === instance.Core.ContentEdit.Types.TEXT;
    if (isTextContentPlaceholder) {
      const contentBoxId = annotation.getCustomData('contentEditBoxId');

      const editManager = core.getDocumentViewer().getContentEditManager();
      const attribs = await editManager.getContentBoxAttributes(contentBoxId);
      const fontName = getFontName(attribs.fontName);
      const { bold, italic, underline, fontColors, fontSize, textAlign, strike } = attribs;
      const color = fontColors?.length > 0 ? new instance.Core.Annotations.Color(fontColors[0].fontColor) : DEFAULT_COLOR;

      if (!fonts.includes(fontName)) {
        setFonts([...fonts, fontName]);
      }

      return {
        Font: fontName,
        FontSize: fontSize,
        textAlign,
        bold,
        italic,
        underline,
        color,
        strike
      };
    }
  };

  const closeTextEditingPanel = () => {
    dispatch(actions.closeElement(dataElement));
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
    !isInDesktopOnlyMode && isMobile
      ? {}
      : css({ width: `${textEditingPanelWidth}px`, minWidth: `${textEditingPanelWidth}px` });

  const [renderNull, setRenderNull] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderNull(!isOpen);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);

  if (isDisabled || (!isOpen && renderNull)) {
    return null;
  }

  const rgbColor = format?.color || DEFAULT_COLOR;

  return (
    <DataElementWrapper dataElement={dataElement} className="Panel TextEditingPanel" css={ style }>
      {!isInDesktopOnlyMode && isMobile && renderMobileCloseButton()}
      <TextEditingPanel
        undoRedoProperties={undoRedoProperties}
        contentSelectMode={selectionMode === instance.Core.ContentEdit.Types.TEXT}
        imageSelectMode={selectionMode === instance.Core.ContentEdit.Types.OBJECT}
        textEditProperties={textEditProperties}
        handlePropertyChange={handlePropertyChange}
        handleZOrderChange={handleZOrderChange}
        format={format}
        handleTextFormatChange={handleTextFormatChange}
        handleColorChange={handleColorChange}
        fonts={fonts}
        handleAddLinkToText={handleAddLinkToText}
        handlePrepareAddLinkToText={handlePrepareAddLinkToText}
        disableLinkButton={!contentEditorRef.current}
        addActiveColor={handleAddActiveColor}
        rgbColor={rgbColor}
        customColors={customColors}
      />
    </DataElementWrapper>
  );
};

export default TextEditingPanelContainer;
