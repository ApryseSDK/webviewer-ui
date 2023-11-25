import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import Icon from 'components/Icon';
import StylePicker from 'components/StylePicker';
import getAnnotationCreateToolNames from 'helpers/getAnnotationCreateToolNames';
import { hexToRGBA } from 'helpers/color';
import setToolStyles from 'helpers/setToolStyles';
import defaultTool from 'constants/defaultTool';
import core from 'core';

const StylePanel = () => {
  const [t] = useTranslation();

  const [isPanelOpen, toolButtonObject] = useSelector((state) => [
    selectors.isElementOpen(state, 'stylePanel'),
    selectors.getToolButtonObjects(state),
  ]);

  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [toolMode, setToolMode] = useState(null);
  const [style, setStyle] = useState({
    Opacity: 1,
    StrokeThickness: 1,
    Scale: [
      [1, 'in'],
      [1, 'in']
    ],
    Precision: 0.1,
    Style: 'solid',
  });
  const [panelTitle, setPanelTitle] = useState('stylePanel.headings.styles');
  const annotationCreateToolNames = getAnnotationCreateToolNames();

  useEffect(() => {
    if (isPanelOpen) {
      if (selectedAnnotation) {
        const annot = selectedAnnotation;
        setStyle({
          ...style,
          StrokeColor: annot.StrokeColor,
          StrokeThickness: annot.StrokeThickness,
          Opacity: annot.Opacity,
        });
      } else if (toolMode && !selectedAnnotation) {
        setStyle(toolMode.defaults);
      }
    }
  }, [isPanelOpen, selectedAnnotation, toolMode]);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (action === 'selected') {
        // We only consider the styles for the style panel if only one annotation is selected
        if (annotations.length === 1) {
          setSelectedAnnotation(annotations[0]);
          setPanelTitle(toolButtonObject[annotations[0].ToolName].title);
        } else {
          setSelectedAnnotation(null);
        }
      } else if (action === 'deselected') {
        setSelectedAnnotation(null);
      }
    };

    const handleToolModeChange = (newTool) => {
      if (annotationCreateToolNames.includes(newTool?.name)) {
        setToolMode(newTool);
        setPanelTitle(toolButtonObject[newTool.name].title);
      } else {
        setToolMode(null);
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    core.addEventListener('toolModeUpdated', handleToolModeChange);
    return () => {
      core.removeEventListener('annotationSelected', onAnnotationSelected);
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
    };
  }, []);

  const onStyleChange = (property, value) => {
    const newStyle = { ...style };
    newStyle[property] = value;
    setStyle(newStyle);
    if (selectedAnnotation) {
      if (property === 'StrokeColor') {
        const colorRGB = hexToRGBA(value);
        selectedAnnotation.StrokeColor = new window.Core.Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
      } else if (property === 'Opacity') {
        selectedAnnotation.Opacity = value;
      }
      core.getAnnotationManager().redrawAnnotation(selectedAnnotation);
    } else if (toolMode && !selectedAnnotation) {
      // Changing to the default tool so the style changes of the tool will be reflected
      // in the tool button once we change to the current tool again.
      core.setToolMode(defaultTool);
      if (property === 'StrokeColor') {
        const colorRGB = hexToRGBA(value);
        const strokeColor = new window.Core.Annotations.Color(colorRGB.r, colorRGB.g, colorRGB.b, colorRGB.a);
        toolMode.setStyles({ StrokeColor: strokeColor });
        core.setToolMode(toolMode.name);
      } else if (property === 'Opacity') {
        setToolStyles(toolMode.name, 'Opacity', value);
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

  const noToolAndNoAnnotationsSelected = !toolMode && !selectedAnnotation;

  // TODO: Remove once tool selection is implemented for the panel
  const lineStyleProperties = {
    StartLineStyle: 'None',
    EndLineStyle: 'None',
    StrokeStyle: 'solid',
  };

  return (
    noToolAndNoAnnotationsSelected ? noToolSelected :
      (<>
        <div className='style-panel-header'>
          {t(panelTitle)}
        </div>
        <div className="label">{t('option.colorPalette.colorLabel')}</div>
        <StylePicker sliderProperties={['Opacity', 'StrokeThickness']}
          style={style} lineStyleProperties={lineStyleProperties}
          onStyleChange={onStyleChange} onLineStyleChange={onStyleChange} />
      </>)
  );
};

export default StylePanel;