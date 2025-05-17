import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import { getStylePanelComponent } from './StylePanelFactory';
import DataElementWrapper from '../DataElementWrapper';
import NoToolStylePanel from './panels/NoToolStylePanel';
import getAnnotationCreateToolNames from 'helpers/getAnnotationCreateToolNames';
import {
  shouldShowNoStyles
} from 'helpers/stylePanelHelper';

import './StylePanel.scss';

const { Annotations } = window.Core;

const StylePanelContainer = () => {
  const isPanelOpen = useSelector((state) => selectors.isElementOpen(state, 'stylePanel'));
  const annotationCreateToolNames = getAnnotationCreateToolNames();

  const [selectedAnnotations, setSelectedAnnotations] = useState(core.getSelectedAnnotations());
  const [currentTool, setCurrentTool] = useState(core.getToolMode());
  const [showStyles, setShowStyles] = useState(false);

  const filteredTypes = [Annotations.PushButtonWidgetAnnotation];

  const handleAnnotationDeselected = () => {
    const latestTool = core.getToolMode();
    if (latestTool instanceof window.Core.Tools.AnnotationEditTool || window.Core.Tools.TextSelectTool) {
      setShowStyles(false);
    }
    setSelectedAnnotations([]);
    handleToolModeChange(latestTool);
    core.setToolMode(latestTool.name);
  };

  const handleAnnotationSelected = (annotations, action) => {
    const annotationManager = core.getAnnotationManager();
    const allSelectedAnnotations = new Set();

    annotations.forEach((annotation) => allSelectedAnnotations.add(annotation));

    annotations.forEach((annotation) => {
      if (annotation.isGrouped()) {
        const groupedAnnotations = annotationManager.getGroupAnnotations(annotation);
        groupedAnnotations.forEach((grouped) => allSelectedAnnotations.add(grouped));
      } else if (annotation.getGroupedChildren().length > 1) {
        annotation.getGroupedChildren().forEach((child) => allSelectedAnnotations.add(child));
      }
    });

    const selectedAnnotations = Array.from(allSelectedAnnotations);

    if (action === 'selected') {
      if (shouldShowNoStyles(selectedAnnotations, filteredTypes)) {
        setShowStyles(false);
        return;
      }
      setSelectedAnnotations(selectedAnnotations);
      setShowStyles(true);
    } else if (action === 'deselected') {
      handleAnnotationDeselected();
    }
  };

  const handleToolModeChange = (newTool) => {
    setCurrentTool(newTool);
    setSelectedAnnotations([]);

    const toolName = newTool?.name;
    if (annotationCreateToolNames.includes(toolName)) {
      setShowStyles(true);
    } else {
      setShowStyles(false);
    }
  };

  useEffect(() => {
    if (isPanelOpen) {
      const annotations = core.getSelectedAnnotations();
      if (annotations.length > 0) {
        setSelectedAnnotations(annotations);
        setShowStyles(true);
      } else {
        const tool = core.getToolMode();
        handleToolModeChange(tool);
      }
    }
  }, [isPanelOpen]);

  useEffect(() => {
    core.addEventListener('annotationSelected', handleAnnotationSelected);
    core.addEventListener('toolModeUpdated', handleToolModeChange);

    return () => {
      core.removeEventListener('annotationSelected', handleAnnotationSelected);
      core.removeEventListener('toolModeUpdated', handleToolModeChange);
    };
  }, []);

  const StylePanelComponent = useMemo(() => {
    if (!showStyles) {
      return NoToolStylePanel;
    }

    return getStylePanelComponent(currentTool, selectedAnnotations);
  }, [showStyles, currentTool, selectedAnnotations]);

  if (!isPanelOpen) {
    return null;
  }

  return (
    <DataElementWrapper dataElement="stylePanel" className="Panel StylePanel">
      <StylePanelComponent
        currentTool={currentTool}
        selectedAnnotations={selectedAnnotations}
      />
    </DataElementWrapper>
  );
};

export default StylePanelContainer;