import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import Icon from 'components/Icon';
import StylePicker from 'components/StylePicker';
import getAnnotationCreateToolNames from 'helpers/getAnnotationCreateToolNames';
import { hexToRGBA } from 'helpers/color';
import getToolStyles from 'helpers/getToolStyles';
import setToolStyles from 'helpers/setToolStyles';
import adjustFreeTextBoundingBox from 'helpers/adjustFreeTextBoundingBox';
import core from 'core';
import { getDataWithKey, mapToolNameToKey } from 'constants/map';
import handleFreeTextAutoSizeToggle from 'helpers/handleFreeTextAutoSizeToggle';
import getTextDecoration from 'helpers/getTextDecoration';
import {
  shouldHideStylePanelOptions,
  extractUniqueFontFamilies,
  stylePanelSectionTitles,
  shouldHideTextStylePicker
} from 'helpers/stylePanelHelper';
import defaultTool from 'constants/defaultTool';

const { ToolNames } = window.Core.Tools;
const { Annotations } = window.Core;


const StylePanel = () => {
  const [t] = useTranslation();

  const [
    isPanelOpen,
    toolButtonObject,
    isAnnotationToolStyleSyncingEnabled,
    activeDocumentViewerKey,
  ] = useSelector((state) => [
    selectors.isElementOpen(state, 'stylePanel'),
    selectors.getToolButtonObjects(state),
    selectors.isAnnotationToolStyleSyncingEnabled(state),
    selectors.getActiveDocumentViewerKey(state),
  ]);


  const currentTool = core.getToolMode();
  const currentToolName = currentTool?.name;
  const colorProperties = ['StrokeColor', 'FillColor'];
  const [showStyles, setShowStyles] = useState(false);
  const [noToolStyle, setNoToolStyle] = useState(shouldHideStylePanelOptions(currentToolName));
  const [isEllipse, setIsEllipse] = useState(false);
  const [isFreeText, setIsFreeText] = useState(false);
  const [isRedaction, setIsRedaction] = useState(currentToolName === ToolNames.REDACTION);
  const [isTextStylePickerHidden, setIsTextStylePickerHidden] = useState(currentToolName === defaultTool ? false : shouldHideTextStylePicker(currentToolName));
  const [isFreeHand, setIsFreeHand] = useState(false);
  const [isArc, setIsArc] = useState(false);
  const [isStamp, setIsStamp] = useState(false);
  const [isInFormFieldCreationMode, setIsInFormFieldCreationMode] = useState(false);
  const [style, setStyle] = useState({});
  const [startLineStyle, setStartLineStyle] = useState();
  const [endLineStyle, setEndLineStyle] = useState();
  const [strokeStyle, setStrokeStyle] = useState();
  const [panelTitle, setPanelTitle] = useState(t('stylePanel.headings.styles'));
  const annotationCreateToolNames = getAnnotationCreateToolNames();
  const [showLineStyleOptions, setShowLineStyleOptions] = useState(currentToolName === defaultTool ? false : getDataWithKey(mapToolNameToKey(currentToolName)).hasLineEndings);
  const [isAutoSizeFont, setIsAutoSizeFont] = useState(style.isAutoSizeFont);
  const [activeTool, setActiveTool] = useState(currentToolName || 'Edit');
  const [editorInstance, setEditorInstance] = useState(null);


  useEffect(() => {
    if (currentTool?.name === 'AnnotationCreateRubberStamp') {
      core.setToolMode(defaultTool);
    }
  }, [currentTool]);

  const getStrokeStyle = (annot) => {
    const style = annot['Style'];
    const dashes = annot['Dashes'];
    if (style !== 'dash') {
      return style;
    }
    return `${style},${dashes}`;
  };

  const getPanelTitleOnAnnotationSelected = (annot) => {
    if (annot.isContentEditPlaceholder()) {
      setPanelTitle(`${t('stylePanel.headings.contentEdit')} ${t('stylePanel.headings.annotation')}`);
      setNoToolStyle(true);
      return;
    }
    setPanelTitle(`${t(stylePanelSectionTitles(annot.ToolName, 'Title') || toolButtonObject[annot.ToolName].title)} ${t('stylePanel.headings.annotation')}`);
  };

  const setPanelTitleForSelectedTool = (tool) => {
    const toolName = tool.name;
    const title = toolButtonObject[toolName].title;
    setPanelTitle(`${t(stylePanelSectionTitles(toolName, 'Title') || title)} ${t('stylePanel.headings.tool')}`);
  };

  const updateStylePanelProps = (annot) => {
    const extraStyles = {};

    if (annot instanceof Annotations.FreeTextAnnotation) {
      let StrokeStyle = 'solid';
      try {
        StrokeStyle = (annot['Style'] === 'dash')
          ? `${annot['Style']},${annot['Dashes']}`
          : annot['Style'];
      } catch (err) {
        console.error(err);
      }
      extraStyles['TextColor'] = annot.TextColor;
      extraStyles['RichTextStyle'] = annot.getRichTextStyle();
      extraStyles['Font'] = annot.Font;
      extraStyles['FontSize'] = annot.FontSize;
      extraStyles['TextAlign'] = annot.TextAlign;
      extraStyles['TextVerticalAlign'] = annot.TextVerticalAlign;
      extraStyles['calculatedFontSize'] = annot.getCalculatedFontSize();
      extraStyles['StrokeStyle'] = StrokeStyle;
      extraStyles['isAutoSizeFont'] = annot.isAutoSizeFont();
      setIsAutoSizeFont(annot.isAutoSizeFont());

      const { fonts, sizes } = extractUniqueFontFamilies(extraStyles['RichTextStyle'], annot.getContents());
      if (fonts.length >= 2 || (fonts.length === 1 && fonts[0] !== extraStyles['Font'])) {
        extraStyles['Font'] = undefined;
      }
      if (sizes.length >= 2 || (sizes.length === 1 && sizes[0] !== extraStyles['FontSize'])) {
        extraStyles['FontSize'] = undefined;
      }
    }

    if (annot instanceof Annotations.RedactionAnnotation) {
      extraStyles['OverlayText'] = annot.OverlayText;
      extraStyles['Font'] = annot.Font;
      extraStyles['FontSize'] = annot.FontSize;
      extraStyles['TextAlign'] = annot.TextAlign;
    }

    if (annot instanceof Annotations.RectangleAnnotation && annot.isFormFieldPlaceholder() && annot.FontSize !== undefined) {
      extraStyles.FontSize = annot.FontSize;
    }

    setStyle({
      ...style,
      StrokeColor: annot.StrokeColor,
      StrokeThickness: annot.StrokeThickness,
      Opacity: annot.Opacity,
      FillColor: annot.FillColor,
      ...extraStyles,
    });
    setStartLineStyle(annot.getStartStyle ? annot.getStartStyle() : 'None');
    setEndLineStyle(annot.getEndStyle ? annot.getEndStyle() : 'None');
    setStrokeStyle(getStrokeStyle(annot));
  };

  useEffect(() => {
    const handleToolModeChange = (newTool) => {
      if (annotationCreateToolNames.includes(newTool?.name)) {
        if (!panelTitle) {
          setShowStyles(false);
        } else {
          if (shouldHideStylePanelOptions(newTool?.name)) {
            setNoToolStyle(true);
            setShowStyles(true);
            setPanelTitleForSelectedTool(newTool);
            return;
          }

          setNoToolStyle(false);
          setActiveTool(newTool.name);
          setShowLineStyleOptions(getDataWithKey(mapToolNameToKey(newTool.name)).hasLineEndings);
          setIsEllipse(newTool.name === ToolNames.ELLIPSE);
          setIsFreeText(newTool.name === ToolNames.FREETEXT);
          setIsRedaction(newTool.name === ToolNames.REDACTION);

          setIsTextStylePickerHidden(shouldHideTextStylePicker(newTool.name));

          setIsFreeHand(
            newTool.name === ToolNames.FREEHAND ||
            newTool.name === ToolNames.FREEHAND_HIGHLIGHT,
          );
          setIsArc(newTool.name === ToolNames.ARC);
          setIsStamp(newTool.name === ToolNames.STAMP);
          setIsInFormFieldCreationMode(core.getFormFieldCreationManager().isInFormFieldCreationMode());
          const toolStyles = getToolStyles(newTool.name);

          if (newTool.name.includes('FreeText') || newTool.name.includes('Callout')) {
            toolStyles['isAutoSizeFont'] = newTool['defaults']['isAutoSizeFont'];
            setIsAutoSizeFont(newTool['defaults']['isAutoSizeFont']);
          }

          setStyle(toolStyles);
          setStartLineStyle(toolStyles.StartLineStyle);
          setStrokeStyle(toolStyles.StrokeStyle);
          setEndLineStyle(toolStyles.EndLineStyle);
          setShowStyles(true);
          setPanelTitleForSelectedTool(newTool);
        }
      } else {
        setShowStyles(false);
      }
    };
    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected') {
        setShowStyles(true);
        if (annotations.length === 1) {
          getPanelTitleOnAnnotationSelected(annotations[0]);
          if (shouldHideStylePanelOptions(annotations[0].ToolName)) {
            setNoToolStyle(true);
            return;
          }
          setNoToolStyle(false);
          setActiveTool(annotations[0].ToolName);
          setIsEllipse(annotations[0] instanceof Annotations.EllipseAnnotation);
          setIsFreeText(annotations[0] instanceof Annotations.FreeTextAnnotation);
          setIsRedaction(annotations[0] instanceof Annotations.RedactionAnnotation);
          setIsTextStylePickerHidden(shouldHideTextStylePicker(annotations[0].ToolName));
          setIsFreeHand(annotations[0] instanceof Annotations.FreeHandAnnotation);
          setIsArc(annotations[0] instanceof Annotations.ArcAnnotation);
          setIsStamp(annotations[0] instanceof Annotations.StampAnnotation);
          setIsInFormFieldCreationMode(core.getFormFieldCreationManager().isInFormFieldCreationMode());
          setShowLineStyleOptions(getDataWithKey(mapToolNameToKey(annotations[0].ToolName)).hasLineEndings);
          updateStylePanelProps(annotations[0]);
        } else {
          setPanelTitle(`${t('stylePanel.headings.annotations')} (${annotations.length})`);
          annotations.forEach((annot) => {
            updateStylePanelProps(annot);
          });
        }
      } else if (action === 'deselected') {
        const currentTool = core.getToolMode();
        if (currentTool instanceof window.Core.Tools.AnnotationEditTool) {
          setShowStyles(false);
        }
        handleToolModeChange(currentTool);
        // reset tool mode to change the tool name in the header
        core.setToolMode(currentTool.name);
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('toolModeUpdated', handleToolModeChange);
    core.addEventListener('annotationChanged', () => {
      for (const annot of core.getSelectedAnnotations()) {
        updateStylePanelProps(annot);
      }
    });
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
    };
  }, []);

  useEffect(() => {
    if (isPanelOpen) {
      const selectedAnnotations = core.getSelectedAnnotations();
      if (selectedAnnotations.length === 1) {
        setShowStyles(true);
        const annot = selectedAnnotations[0];
        updateStylePanelProps(annot);
        getPanelTitleOnAnnotationSelected(annot);
      } else if (selectedAnnotations.length > 1) {
        setShowStyles(true);
        setPanelTitle(`${t('stylePanel.headings.annotations')} (${selectedAnnotations.length})`);
        selectedAnnotations.forEach((annot) => {
          updateStylePanelProps(annot);
        });
      } else {
        const currentTool = core.getToolMode();
        if (currentTool && currentTool.name !== defaultTool) {
          setShowStyles(true);
          const toolStyles = getToolStyles(currentTool.name);
          if (toolStyles) {
            setStyle(toolStyles);
            setStartLineStyle(toolStyles.StartLineStyle);
            setEndLineStyle(toolStyles.EndLineStyle);
            setStrokeStyle(toolStyles.StrokeStyle);
          }
          setPanelTitleForSelectedTool(currentTool);
        }
      }
    }
  }, [isPanelOpen, isAutoSizeFont]);

  const onStyleChange = (property, value) => {
    const newStyle = { ...style };
    newStyle[property] = value;
    setStyle(newStyle);
    const annotationsToUpdate = core.getSelectedAnnotations();

    // Newly created freetext is not saved in annotationManager yet, so getSelectedAnnotations
    // will return empty array, but editor has focus and an annotation
    if (annotationsToUpdate.length === 0 && editorInstance && property === 'FillColor') {
      const editor = editorInstance[0];
      if (editor?.hasFocus()) {
        const annot = editorInstance[1];
        editor.setStyle({ background: value });
        annot['FillColor'] = new Annotations.Color(value);
        return;
      }
    }

    if (annotationsToUpdate.length > 0) {
      annotationsToUpdate.forEach((annot) => {
        if (colorProperties.includes(property)) {
          const colorRGB = hexToRGBA(value);
          const color = new Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
          annot[property] = color;
          if (isAnnotationToolStyleSyncingEnabled) {
            setToolStyles(annot.ToolName, property, color);
          }
        } else {
          annot[property] = value;
          if (annot instanceof Annotations.FreeTextAnnotation) {
            if (property === 'FontSize' || property === 'Font' || property === 'StrokeThickness') {
              adjustFreeTextBoundingBox(annot);
            }
          }
          if (isAnnotationToolStyleSyncingEnabled) {
            setToolStyles(annot.ToolName, property, value);
          }
        }

        core.getAnnotationManager().redrawAnnotation(annot);
      });
    } else {
      const currentTool = core.getToolMode();
      if (currentTool) {
        if (colorProperties.includes(property)) {
          const colorRGB = hexToRGBA(value);
          const color = new Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
          setToolStyles(currentTool.name, property, color);
        } else if (property === 'Opacity') {
          setToolStyles(currentTool.name, 'Opacity', value);
        } else if (property === 'StrokeThickness') {
          setToolStyles(currentTool.name, 'StrokeThickness', value);
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
    } else if (section === 'middle') {
      setStrokeStyle(value);
    } else if (section === 'end') {
      setEndLineStyle(value);
    }
    const annotationsToUpdate = core.getSelectedAnnotations();
    if (annotationsToUpdate.length > 0) {
      annotationsToUpdate.forEach((annot) => {
        if (section === 'start') {
          annot.setStartStyle(value);
        } else if (section === 'middle') {
          const dashes = value.split(',');
          const lineStyle = dashes.shift();
          annot.Style = lineStyle;
          annot.Dashes = dashes;
        } else if (section === 'end') {
          annot.setEndStyle(value);
        }
        core.getAnnotationManager().redrawAnnotation(annot);
        if (isAnnotationToolStyleSyncingEnabled) {
          setToolStyles(annot.ToolName, sectionPropertyMap[section], value);
        }
      });
    } else {
      const currentTool = core.getToolMode();
      if (currentTool) {
        setToolStyles(currentTool.name, sectionPropertyMap[section], value);
      }
    }
  };
  const handleAutoSize = () => {
    const annotationsToUpdate = core.getSelectedAnnotations()[0];
    if (annotationsToUpdate) {
      handleFreeTextAutoSizeToggle(annotationsToUpdate, setIsAutoSizeFont, isAutoSizeFont);
    } else {
      const currentTool = core.getToolMode();
      if (currentTool) {
        setToolStyles(currentTool.name, 'isAutoSizeFont', !style.isAutoSizeFont);
        setIsAutoSizeFont(!isAutoSizeFont);
      }
    }
  };

  const noToolSelected = (
    <>
      <div className='style-panel-header'>
        {t('stylePanel.headings.styles')}
      </div>
      <div className="no-tool-selected">
        <div>
          <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
        </div>
        <div className="msg">{t('stylePanel.noToolSelected')}</div>
      </div>
    </>
  );

  const handleRichTextStyleChange = (property, value) => {
    const originalProperty = property;
    const originalValue = value;
    const activeToolRichTextStyle = style['RichTextStyle']?.[0];
    if (property === 'underline' || property === 'line-through') {
      value = getTextDecoration({ [property]: value }, activeToolRichTextStyle);
      property = 'text-decoration';
    }
    const richTextStyle = {
      0: {
        ...activeToolRichTextStyle,
        [property]: value,
      }
    };

    const annotationsToUpdate = core.getSelectedAnnotations();
    if (annotationsToUpdate.length > 0) {
      annotationsToUpdate.forEach((annotation) => {
        core.updateAnnotationRichTextStyle(annotation, { [originalProperty]: originalValue }, activeDocumentViewerKey);
      });
      setStyle({ ...style, 'RichTextStyle': richTextStyle });
    } else {
      const currentTool = core.getToolMode();
      if (currentTool) {
        if (typeof currentTool.complete === 'function') {
          currentTool.complete();
        }
        setToolStyles(currentTool.name, 'RichTextStyle', richTextStyle);
      }
    }
  };

  return !showStyles ? (
    noToolSelected
  ) : (
    <>
      <div className="style-panel-header">{panelTitle}</div>
      {noToolStyle ? (
        <div className="no-tool-selected">
          <div>
            <Icon className="empty-icon" glyph="style-panel-no-tool-selected" />
          </div>
          <div className="msg">{t('stylePanel.noToolStyle')}</div>
        </div>
      ) : (
        <StylePicker
          sliderProperties={['Opacity', 'StrokeThickness']}
          style={style}
          onStyleChange={onStyleChange}
          isFreeText={isFreeText}
          isEllipse={isEllipse}
          isRedaction={isRedaction}
          isTextStylePickerHidden={isTextStylePickerHidden}
          isFreeHand={isFreeHand}
          isArc={isArc}
          isStamp={isStamp}
          isInFormFieldCreationMode={isInFormFieldCreationMode}
          showLineStyleOptions={showLineStyleOptions}
          startLineStyle={startLineStyle}
          endLineStyle={endLineStyle}
          strokeStyle={strokeStyle}
          onLineStyleChange={onLineStyleChange}
          onFreeTextSizeToggle={handleAutoSize}
          isFreeTextAutoSize={isAutoSizeFont}
          handleRichTextStyleChange={handleRichTextStyleChange}
          activeTool={activeTool}
          saveEditorInstance={setEditorInstance}
        />
      )}
    </>
  );
};

export default StylePanel;