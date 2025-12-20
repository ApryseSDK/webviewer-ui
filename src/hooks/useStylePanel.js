import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import { getDataWithKey, mapToolNameToKey } from 'constants/map';
import getToolStyles from 'helpers/getToolStyles';
import setToolStyles from 'helpers/setToolStyles';
import adjustFreeTextBoundingBox from 'helpers/adjustFreeTextBoundingBox';
import handleFreeTextAutoSizeToggle from 'helpers/handleFreeTextAutoSizeToggle';
import getTextDecoration from 'helpers/getTextDecoration';
import { hexToRGBA } from 'helpers/color';
import { extractUniqueFontFamilies, stylePanelSectionTitles } from 'helpers/stylePanelHelper';
import { useTranslation } from 'react-i18next';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

const { Annotations } = window.Core;

const useStylePanel = ({ selectedAnnotations, currentTool }) => {
  const { t, i18n } = useTranslation();
  const [style, setStyle] = useState({
    StrokeColor: null,
    StrokeThickness: null,
    Opacity: null,
    FillColor: null,
  });
  const [panelTitle, setPanelTitle] = useState('');
  const [strokeStyle, setStrokeStyle] = useState('');
  const [startLineStyle, setStartLineStyle] = useState('');
  const [endLineStyle, setEndLineStyle] = useState('');
  const [isAutoSizeFont, setIsAutoSizeFont] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const currentToolName = currentTool?.name;
  const [showLineStyleOptions, setShowLineStyleOptions] = useState(currentToolName === defaultTool ? false : getDataWithKey(mapToolNameToKey(currentToolName)).hasLineEndings);
  const colorProperties = ['StrokeColor', 'FillColor'];
  const dispatch = useDispatch();


  const [
    toolButtonObject,
    isAnnotationToolStyleSyncingEnabled,
    activeDocumentViewerKey,
  ] = useSelector((state) => [
    selectors.getToolButtonObjects(state),
    selectors.isAnnotationToolStyleSyncingEnabled(state),
    selectors.getActiveDocumentViewerKey(state),
  ]);

  const selectedAnnotation = selectedAnnotations?.[0];

  useEffect(() => {
    updateSnapModeFromTool(currentTool);
  }, [currentTool]);

  const updateSnapModeFromTool = (currentTool) => {
    if (!core.isFullPDFEnabled()) {
      return;
    }
    if (currentTool && currentTool.getSnapMode) {
      const isSnapModeEnabled = !!currentTool.getSnapMode();
      dispatch(actions.setEnableSnapMode({ toolName: currentTool.name, isEnabled: isSnapModeEnabled }));
    }
  };

  const setPanelTitleForSelectedTool = (tool) => {
    const toolName = tool.name;
    const title = toolButtonObject[toolName]?.title;
    setPanelTitle(`${t(stylePanelSectionTitles(toolName, 'Title') || title)} ${t('stylePanel.headings.tool')}`);
  };

  const setPanelTitleForAnnotation = (annotation) => {
    if (annotation.isContentEditPlaceholder()) {
      setPanelTitle(`${t('stylePanel.headings.contentEdit')} ${t('stylePanel.headings.annotation')}`);
      return;
    }
    setPanelTitle(`${t(stylePanelSectionTitles(annotation.ToolName, 'Title') || toolButtonObject[annotation.ToolName]?.title)} ${t('stylePanel.headings.annotation')}`);
  };

  const setPanelTitleForMultipleAnnotations = (annotations) => {
    setPanelTitle(`${t('stylePanel.headings.annotations')} (${annotations.length})`);
  };

  const getStrokeStyle = (annotation) => {
    const style = annotation['Style'];
    const dashes = annotation['Dashes'];
    return style !== 'dash' ? style : `${style},${dashes}`;
  };

  const applyFreeTextStyles = (annotation) => {
    const extraStyles = {};

    let StrokeStyle = 'solid';
    try {
      StrokeStyle = (annotation['Style'] === 'dash')
        ? `${annotation['Style']},${annotation['Dashes']}`
        : annotation['Style'];
    } catch (err) {
      console.error(err);
    }

    extraStyles.TextColor = annotation.TextColor;
    extraStyles.RichTextStyle = annotation.getRichTextStyle();
    extraStyles.Font = annotation.Font;
    extraStyles.FontSize = annotation.FontSize;
    extraStyles.TextAlign = annotation.TextAlign;
    extraStyles.TextVerticalAlign = annotation.TextVerticalAlign;
    extraStyles.calculatedFontSize = annotation.getCalculatedFontSize();
    extraStyles.StrokeStyle = StrokeStyle;
    extraStyles.isAutoSizeFont = annotation.isAutoSizeFont();
    setIsAutoSizeFont(annotation.isAutoSizeFont());

    const { fonts, sizes } = extractUniqueFontFamilies(extraStyles.RichTextStyle, annotation.getContents());
    if (fonts.length >= 2 || (fonts.length === 1 && fonts[0] !== extraStyles.Font)) {
      extraStyles.Font = undefined;
    }
    if (sizes.length >= 2 || (sizes.length === 1 && sizes[0] !== extraStyles.FontSize)) {
      extraStyles.FontSize = undefined;
    }

    return extraStyles;
  };

  const updateStylePanelProps = (annotation) => {
    let extraStyles = {};
    if (annotation instanceof Annotations.FreeTextAnnotation) {
      extraStyles = applyFreeTextStyles(annotation);
    }

    if (annotation instanceof Annotations.RedactionAnnotation) {
      extraStyles['OverlayText'] = annotation.OverlayText;
      extraStyles['Font'] = annotation.Font;
      extraStyles['FontSize'] = annotation.FontSize;
      extraStyles['TextAlign'] = annotation.TextAlign;
    }

    if (annotation instanceof Annotations.WidgetAnnotation && annotation.FontSize !== undefined) {
      extraStyles.FontSize = annotation.FontSize;
    }

    setStyle((previousStyle) => {
      return {
        ...previousStyle,
        StrokeColor: annotation.StrokeColor ?? null,
        StrokeThickness: annotation.StrokeThickness ?? null,
        Opacity: annotation.Opacity ?? null,
        FillColor: annotation.FillColor ?? null,
        ...extraStyles,
      };
    });

    setStartLineStyle(annotation.getStartStyle ? annotation.getStartStyle() : 'None');
    setEndLineStyle(annotation.getEndStyle ? annotation.getEndStyle() : 'None');
    setStrokeStyle(getStrokeStyle(annotation));
  };

  const updateFromTool = (tool) => {
    const toolName = tool.name;
    const styles = getToolStyles(toolName);

    if (toolName.includes('FreeText') || toolName.includes('Callout')) {
      styles.isAutoSizeFont = tool.defaults?.isAutoSizeFont;
      setIsAutoSizeFont(styles.isAutoSizeFont);
    }

    setStyle(styles || {});
    setStartLineStyle(styles?.StartLineStyle || '');
    setEndLineStyle(styles?.EndLineStyle || '');
    setStrokeStyle(styles?.StrokeStyle || '');
    setPanelTitleForSelectedTool(tool);
  };

  useEffect(() => {
    if (selectedAnnotation) {
      if (selectedAnnotations.length > 1) {
        setPanelTitleForMultipleAnnotations(selectedAnnotations);
      } else {
        setPanelTitleForAnnotation(selectedAnnotation);
      }
      updateStylePanelProps(selectedAnnotation);
      const hasLineEndings = selectedAnnotations.every((annotation) => getDataWithKey(mapToolNameToKey(annotation.ToolName)).hasLineEndings);
      setShowLineStyleOptions(hasLineEndings);
    } else if (currentTool) {
      updateFromTool(currentTool);
      setShowLineStyleOptions(getDataWithKey(mapToolNameToKey(currentToolName)).hasLineEndings);
    }
  }, [selectedAnnotation, currentTool, selectedAnnotations, i18n.language]);

  const getColorFromHex = (hex) => {
    const colorRGB = hexToRGBA(hex);
    const color = new Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
    return color;
  };

  const onStyleChange = (property, value, doneStyleChange = true) => {
    setStyle((previousStyle) => {
      return { ...previousStyle, [property]: value };
    });

    if (selectedAnnotations.length === 0 && editorInstance && property === 'FillColor') {
      const editor = editorInstance[0];
      if (editor?.hasFocus()) {
        const annotation = editorInstance[1];
        editor.setStyle({ background: value });
        annotation['FillColor'] = new Annotations.Color(value);
        return;
      }
    }

    const newValue = colorProperties.includes(property) ? getColorFromHex(value) : value;

    if (selectedAnnotations.length > 0) {
      selectedAnnotations.forEach((annotation) => {
        if (doneStyleChange) {
          core.setAnnotationStyles(annotation, { [property]: newValue }, activeDocumentViewerKey);
          if (isAnnotationToolStyleSyncingEnabled) {
            setToolStyles(annotation.ToolName, property, newValue);
          }
        } else {
          annotation[property] = newValue;
        }
        if (annotation instanceof Annotations.FreeTextAnnotation && ['FontSize', 'Font', 'StrokeThickness'].includes(property)) {
          adjustFreeTextBoundingBox(annotation);
        }
        core.getAnnotationManager().redrawAnnotation(annotation);
        if (annotation instanceof Annotations.WidgetAnnotation) {
          annotation.refresh();
        }
      });
    } else {
      const currentTool = core.getToolMode();
      if (currentTool) {
        if (doneStyleChange) {
          setToolStyles(currentTool.name, property, newValue);
        }
        if (currentTool instanceof window.Core.Tools.RubberStampCreateTool) {
          currentTool.showPreview();
        }
      }
    }
  };

  const onLineStyleChange = (section, value) => {
    const sectionPropertyMap = {
      start: 'StartLineStyle',
      middle: 'StrokeStyle',
      end: 'EndLineStyle',
    };
    if (section === 'start') {
      setStartLineStyle(value);
    }
    if (section === 'middle') {
      setStrokeStyle(value);
    }
    if (section === 'end') {
      setEndLineStyle(value);
    }

    if (selectedAnnotations.length > 0) {
      selectedAnnotations.forEach((annotation) => {
        if (section === 'start') {
          annotation.setStartStyle(value);
        }
        if (section === 'middle') {
          const dashes = value.split(',');
          annotation.Style = dashes.shift();
          annotation.Dashes = dashes.length ? dashes : null;
        }
        if (section === 'end') {
          annotation.setEndStyle(value);
        }
        core.getAnnotationManager(activeDocumentViewerKey).redrawAnnotation(annotation);
        if (isAnnotationToolStyleSyncingEnabled) {
          setToolStyles(annotation.ToolName, sectionPropertyMap[section], value);
        }
      });
      core.getAnnotationManager(activeDocumentViewerKey).trigger('annotationChanged', [selectedAnnotations, 'modify', {}]);
    } else {
      const currentTool = core.getToolMode();
      if (currentTool) {
        setToolStyles(currentTool.name, sectionPropertyMap[section], value);
      }
    }
  };

  const handleAutoSize = () => {
    if (selectedAnnotations.length > 0) {
      selectedAnnotations.forEach((annotation) => {
        if (editorInstance && editorInstance[0]) {
          const editor = editorInstance[0];
          const text = editor.getContents();
          // We are trimming the New Line that the Quill Editor adds and requires internally
          const trimContents = (text?.length > 0 && text?.endsWith('\n')) ? text.slice(0, -1) : text;
          annotation.setContents(trimContents);
        }
        handleFreeTextAutoSizeToggle(annotation, setIsAutoSizeFont, isAutoSizeFont);
      });
    } else if (currentTool) {
      setToolStyles(currentTool.name, 'isAutoSizeFont', !isAutoSizeFont);
      setIsAutoSizeFont(!isAutoSizeFont);
    }
  };

  const handleRichTextStyleChange = (property, value) => {
    const richStyle = style.RichTextStyle?.[0] || {};
    const newValue = ['underline', 'line-through'].includes(property)
      ? getTextDecoration({ [property]: value }, richStyle)
      : value;

    const richTextStyle = {
      0: {
        ...richStyle,
        [property === 'underline' || property === 'line-through' ? 'text-decoration' : property]: newValue,
      },
    };

    if (selectedAnnotations.length > 0) {
      selectedAnnotations.forEach((annotation) => {
        core.updateAnnotationRichTextStyle(annotation, { [property]: value }, activeDocumentViewerKey);
      });
    } else if (currentTool) {
      setToolStyles(currentTool.name, 'RichTextStyle', richTextStyle);
    }

    setStyle((previousStyle) => {
      return { ...previousStyle, RichTextStyle: richTextStyle };
    });
  };

  return {
    panelTitle,
    style,
    strokeStyle,
    startLineStyle,
    endLineStyle,
    onStyleChange,
    onLineStyleChange,
    isAutoSizeFont,
    handleAutoSize,
    handleRichTextStyleChange,
    saveEditorInstance: setEditorInstance,
    activeTool: currentTool?.name,
    showLineStyleOptions,
  };
};

export default useStylePanel;