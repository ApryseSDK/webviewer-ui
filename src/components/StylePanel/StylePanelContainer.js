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
import classNames from 'classnames';
import PropTypes from 'prop-types';
import DataElements from 'constants/dataElement';

import './StylePanel.scss';

const { Annotations } = window.Core;

const propTypes = {
  dataElement: PropTypes.string,
  isFlyout: PropTypes.bool,
};

const StylePanelContainer = ({ dataElement = DataElements.STYLE_PANEL, isFlyout = false }) => {
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

    const annotationsArray = Array.from(allSelectedAnnotations);
    const modifiableAnnotations = annotationsArray.filter((annotation) => core.canModify(annotation));

    setSelectedAnnotations(modifiableAnnotations);
    setCurrentTool(tool);
  }, 150, { leading: false, trailing: true });

  useEffect(() => {
    if (isPanelOpen || isFlyout) {
      handleChange();
    }
    return () => {
      handleChange.cancel();
    };
  }, [isPanelOpen, isFlyout]);

  useEffect(() => {
    core.addEventListener('annotationSelected', handleChange);
    core.addEventListener('toolModeUpdated', handleChange);

    return () => {
      core.removeEventListener('annotationSelected', handleChange);
      core.removeEventListener('toolModeUpdated', handleChange);
      handleChange.cancel();
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

  if (!isPanelOpen && !isFlyout) {
    return null;
  }

  const StylePanelComponent = getComponent();

  return (
    <DataElementWrapper dataElement={dataElement} className={classNames('Panel', 'StylePanel', { 'isFlyout': isFlyout })}  >
      <StylePanelComponent
        currentTool={currentTool}
        selectedAnnotations={selectedAnnotations}
      />
    </DataElementWrapper>
  );
};

StylePanelContainer.propTypes = propTypes;

export default StylePanelContainer;