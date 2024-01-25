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
import core from 'core';
import { getDataWithKey, mapToolNameToKey } from 'constants/map';
import handleFreeTextAutoSizeToggle from 'helpers/handleFreeTextAutoSizeToggle';
import getTextDecoration from 'helpers/getTextDecoration';
import { shouldHideStylePanelOptions, stylePanelSectionTitles } from 'helpers/stylePanelHelper';

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

  const colorProperties = ['StrokeColor', 'FillColor'];
  const [showPanel, setShowPanel] = useState(false);
  const [noToolStyle, setNoToolStyle] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [isEllipse, setIsEllipse] = useState(false);
  const [isFreeText, setIsFreeText] = useState(false);
  const [isRedaction, setIsRedaction] = useState(false);
  const [isFreeHand, setIsFreeHand] = useState(false);
  const [isArc, setIsArc] = useState(false);
  const [isInFormFieldCreationMode, setIsInFormFieldCreationMode] = useState(false);
  const [style, setStyle] = useState({});
  const [startLineStyle, setStartLineStyle] = useState();
  const [endLineStyle, setEndLineStyle] = useState();
  const [strokeStyle, setStrokeStyle] = useState();
  const [panelTitle, setPanelTitle] = useState(t('stylePanel.headings.styles'));
  const annotationCreateToolNames = getAnnotationCreateToolNames();
  const [showLineStyleOptions, setShowLineStyleOptions] = useState(false);
  const [isAutoSizeFont, setIsAutoSizeFont] = useState(style.isAutoSizeFont);

  const getStrokeStyle = (annot) => {
    const style = annot['Style'];
    const dashes = annot['Dashes'];
    if (style !== 'dash') {
      return style;
    }
    return `${style},${dashes}`;
  };

  useEffect(() => {
    if (!selectedAnnotation && showPanel) {
      const toolName = core.getToolMode().name;
      const title = toolButtonObject[toolName].title;
      setPanelTitle(`${t(stylePanelSectionTitles(toolName, 'Title') || title)} ${t('stylePanel.headings.tool')}`);
    }
  });

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected') {
        // We only consider the styles for the style panel if only one annotation is selected
        if (annotations.length === 1) {
          setSelectedAnnotation(annotations[0]);
          if (annotations[0].isContentEditPlaceholder()) {
            setPanelTitle(`${t('stylePanel.headings.contentEdit')} ${t('stylePanel.headings.annotation')}`);
            setNoToolStyle(true);
            return;
          }
          setPanelTitle(`${t(stylePanelSectionTitles(annotations[0].ToolName, 'Title') || toolButtonObject[annotations[0].ToolName].title)} ${t('stylePanel.headings.annotation')}`);
          if (shouldHideStylePanelOptions(annotations[0].ToolName)) {
            setNoToolStyle(true);
            return;
          }
          setNoToolStyle(false);

          setIsEllipse(annotations[0] instanceof window.Core.Annotations.EllipseAnnotation);
          setIsFreeText(annotations[0] instanceof window.Core.Annotations.FreeTextAnnotation);
          setIsRedaction(annotations[0] instanceof window.Core.Annotations.RedactionAnnotation);
          setIsFreeHand(annotations[0] instanceof window.Core.Annotations.FreeHandAnnotation);
          setIsArc(annotations[0] instanceof window.Core.Annotations.ArcAnnotation);
          setIsInFormFieldCreationMode(core.getFormFieldCreationManager().isInFormFieldCreationMode());
          setShowLineStyleOptions(getDataWithKey(mapToolNameToKey(annotations[0].ToolName)).hasLineEndings);
        } else {
          setPanelTitle(`${t('stylePanel.headings.annotations')} (${annotations.length})`);
        }
        setShowPanel(true);
      } else if (action === 'deselected') {
        const currentTool = core.getToolMode();
        if (currentTool instanceof window.Core.Tools.AnnotationEditTool) {
          setShowPanel(false);
        }
        // reset tool mode to change the tool name in the header
        core.setToolMode(currentTool.name);
        setSelectedAnnotation(null);
      }
    };

    const handleToolModeChange = (newTool) => {
      if (annotationCreateToolNames.includes(newTool?.name)) {
        if (!panelTitle) {
          setShowPanel(false);
        } else {
          if (shouldHideStylePanelOptions(newTool?.name)) {
            setNoToolStyle(true);
            setShowPanel(true);
            return;
          }
          setNoToolStyle(false);

          setShowLineStyleOptions(getDataWithKey(mapToolNameToKey(newTool.name)).hasLineEndings);

          setIsEllipse(newTool.name === window.Core.Tools.ToolNames.ELLIPSE);
          setIsFreeText(newTool.name === window.Core.Tools.ToolNames.FREE_TEXT);
          setIsRedaction(newTool.name === window.Core.Tools.ToolNames.REDACTION);
          setIsFreeHand(
            newTool.name === window.Core.Tools.ToolNames.FREEHAND ||
              newTool.name === window.Core.Tools.ToolNames.FREEHAND_HIGHLIGHT,
          );
          setIsArc(newTool.name === window.Core.Tools.ToolNames.ARC);
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
          setShowPanel(true);
        }
      } else {
        setShowPanel(false);
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('toolModeUpdated', handleToolModeChange);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
    };
  }, []);

  useEffect(() => {
    if (isPanelOpen) {
      if (selectedAnnotation) {
        const annot = selectedAnnotation;
        const extraStyles = {};

        if (annot instanceof window.Core.Annotations.FreeTextAnnotation) {
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
        }

        if (annot instanceof window.Core.Annotations.RedactionAnnotation) {
          extraStyles['OverlayText'] = annot.OverlayText;
          extraStyles['Font'] = annot.Font;
          extraStyles['FontSize'] = annot.FontSize;
          extraStyles['TextAlign'] = annot.TextAlign;
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
      } else {
        const currentTool = core.getToolMode();
        if (currentTool) {
          const toolStyles = getToolStyles(currentTool.name);
          if (toolStyles) {
            setStyle(toolStyles);
            setStartLineStyle(toolStyles.StartLineStyle);
            setEndLineStyle(toolStyles.EndLineStyle);
            setStrokeStyle(toolStyles.StrokeStyle);
          }
        }
      }
    }
  }, [isPanelOpen, selectedAnnotation]);

  const onStyleChange = (property, value) => {
    const newStyle = { ...style };
    newStyle[property] = value;
    setStyle(newStyle);

    const annotationsToUpdate = core.getSelectedAnnotations();
    if (annotationsToUpdate.length > 0) {
      annotationsToUpdate.forEach((annot) => {
        if (colorProperties.includes(property)) {
          const colorRGB = hexToRGBA(value);
          const color = new window.Core.Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
          annot[property] = color;
          if (isAnnotationToolStyleSyncingEnabled) {
            setToolStyles(annot.ToolName, property, color);
          }
        } else {
          annot[property] = value;
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
          const color = new window.Core.Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
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

    if (property === 'FillColor' && selectedAnnotation instanceof window.Core.Annotations.FreeTextAnnotation) {
      const editor = selectedAnnotation.getEditor();
      if (editor?.hasFocus()) {
        editor.setStyle({ background: value });
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
    if (selectedAnnotation) {
      handleFreeTextAutoSizeToggle(selectedAnnotation, setIsAutoSizeFont, isAutoSizeFont);
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
    const activeToolRichTextStyle = style['RichTextStyle'][0];
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

  return !showPanel ? (
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
          isFreeHand={isFreeHand}
          isArc={isArc}
          isInFormFieldCreationMode={isInFormFieldCreationMode}
          showLineStyleOptions={showLineStyleOptions}
          startLineStyle={startLineStyle}
          endLineStyle={endLineStyle}
          strokeStyle={strokeStyle}
          onLineStyleChange={onLineStyleChange}
          toolName={selectedAnnotation?.ToolName || core.getToolMode()?.name}
          onFreeTextSizeToggle={handleAutoSize}
          isFreeTextAutoSize={isAutoSizeFont}
          handleRichTextStyleChange={handleRichTextStyleChange}
        />
      )}
    </>
  );
};

export default StylePanel;