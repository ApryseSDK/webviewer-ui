import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import { getStylePanelComponent } from './StylePanelFactory';
import DataElementWrapper from '../DataElementWrapper';
import NoToolStylePanel from './panels/NoToolStylePanel';
import getAnnotationCreateToolNames from 'helpers/getAnnotationCreateToolNames';
import { shouldShowNoStyles } from 'helpers/stylePanelHelper';
import debounce from 'lodash/debounce';

import './StylePanel.scss';

const { Annotations } = window.Core;

const StylePanelContainer = () => {
  const isPanelOpen = useSelector((state) => selectors.isElementOpen(state, 'stylePanel'));
  const annotationCreateToolNames = getAnnotationCreateToolNames();

  const [selectedAnnotations, setSelectedAnnotations] = useState(core.getSelectedAnnotations());
  const [currentTool, setCurrentTool] = useState(core.getToolMode());

  const filteredTypes = [Annotations.PushButtonWidgetAnnotation];

  const handleChange = debounce(() => {
    const annotationManager = core.getAnnotationManager();
    const tool = core.getToolMode();
    const annotations = core.getSelectedAnnotations();

    const allSelectedAnnotations = new Set(annotations);
    annotations.forEach((annotation) => {
      if (annotation.isGrouped()) {
        const groupedAnnotations = annotationManager.getGroupAnnotations(annotation);
        groupedAnnotations.forEach((grouped) => allSelectedAnnotations.add(grouped));
      } else if (annotation.getGroupedChildren().length > 1) {
        annotation.getGroupedChildren().forEach((child) => allSelectedAnnotations.add(child));
      }
    });
    const selectedAnnotations = Array.from(allSelectedAnnotations);

    setSelectedAnnotations(selectedAnnotations);
    setCurrentTool(tool);
  }, 150, { leading: false, trailing: true });

  useEffect(() => {
    if (isPanelOpen) {
      handleChange();
    }
  }, [isPanelOpen]);

  useEffect(() => {
    core.addEventListener('annotationSelected', handleChange);
    core.addEventListener('toolModeUpdated', handleChange);

    return () => {
      core.removeEventListener('annotationSelected', handleChange);
      core.removeEventListener('toolModeUpdated', handleChange);
    };
  }, []);

  const getComponent = () => {
    const hideStyles = selectedAnnotations.length > 0 ?
      shouldShowNoStyles(selectedAnnotations, filteredTypes) :
      !annotationCreateToolNames.includes(currentTool?.name);

    if (hideStyles) {
      return NoToolStylePanel;
    }

    return getStylePanelComponent(currentTool, selectedAnnotations);
  };

  if (!isPanelOpen) {
    return null;
  }

  const StylePanelComponent = getComponent();

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