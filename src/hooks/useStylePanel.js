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
import {
  extractUniqueFontFamilies,
  stylePanelSectionTitles,
} from 'helpers/stylePanelHelper';
import { useTranslation } from 'react-i18next';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';

const { Annotations } = window.Core;

const useStylePanel = ({ selectedAnnotations, currentTool }) => {
  const [t] = useTranslation();
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
    if (currentTool?.name === 'AnnotationCreateRubberStamp') {
      core.setToolMode(defaultTool);
    }
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

    setStyle({
      ...style,
      StrokeColor: annotation.StrokeColor ?? null,
      StrokeThickness: annotation.StrokeThickness ?? null,
      Opacity: annotation.Opacity ?? null,
      FillColor: annotation.FillColor ?? null,
      ...extraStyles,
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

    setStyle(styles);
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
      setShowLineStyleOptions(getDataWithKey(mapToolNameToKey(selectedAnnotation.ToolName)).hasLineEndings);
    } else if (currentTool) {
      updateFromTool(currentTool);
      setShowLineStyleOptions(getDataWithKey(mapToolNameToKey(currentToolName)).hasLineEndings);
    }
  }, [selectedAnnotation, currentTool]);

  const onStyleChange = (property, value) => {
    const newStyle = { ...style, [property]: value };
    setStyle(newStyle);

    if (selectedAnnotations.length === 0 && editorInstance && property === 'FillColor') {
      const editor = editorInstance[0];
      if (editor?.hasFocus()) {
        const annotation = editorInstance[1];
        editor.setStyle({ background: value });
        annotation['FillColor'] = new Annotations.Color(value);
        return;
      }
    }

    if (selectedAnnotations.length > 0) {
      selectedAnnotations.forEach((annotation) => {
        if (colorProperties.includes(property)) {
          const colorRGB = hexToRGBA(value);
          const color = new Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
          core.setAnnotationStyles(annotation, { [property]: color }, activeDocumentViewerKey);
          if (isAnnotationToolStyleSyncingEnabled) {
            setToolStyles(annotation.ToolName, property, color);
          }
        } else {
          core.setAnnotationStyles(annotation, { [property]: value }, activeDocumentViewerKey);
          if (annotation instanceof Annotations.FreeTextAnnotation && ['FontSize', 'Font', 'StrokeThickness'].includes(property)) {
            adjustFreeTextBoundingBox(annotation);
          }
          if (isAnnotationToolStyleSyncingEnabled) {
            setToolStyles(annotation.ToolName, property, value);
          }
        }
        core.getAnnotationManager().redrawAnnotation(annotation);
        if (annotation instanceof Annotations.WidgetAnnotation) {
          annotation.refresh();
        }
      });
    } else {
      const currentTool = core.getToolMode();
      if (currentTool) {
        if (colorProperties.includes(property)) {
          const colorRGB = hexToRGBA(value);
          const color = new Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
          setToolStyles(currentTool.name, property, color);
        } else {
          setToolStyles(currentTool.name, property, value);
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
          annotation.Dashes = dashes;
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
    const annotation = selectedAnnotations[0];
    if (annotation) {
      handleFreeTextAutoSizeToggle(annotation, setIsAutoSizeFont, isAutoSizeFont);
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

    setStyle({ ...style, RichTextStyle: richTextStyle });
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