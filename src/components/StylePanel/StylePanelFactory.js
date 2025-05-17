import TextStylePanel from './panels/TextStylePanel';
import DefaultStylePanel from './panels/DefaultStylePanel';
import NoSharedStylePanel from './panels/NoSharedStylePanel';
import { getAnnotationTypes, shouldShowTextStyle, shouldHideSharedStyleOptions } from 'helpers/stylePanelHelper';

const getPanelFromNames = (toolNames) => {
  if (toolNames.length > 1 && toolNames.some((toolName) => shouldHideSharedStyleOptions(toolName))) {
    return NoSharedStylePanel;
  }
  if (toolNames.every((toolName) => shouldShowTextStyle(toolName))) {
    return TextStylePanel;
  }
  return DefaultStylePanel;
};

export const getStylePanelComponent = (currentTool, selectedAnnotations) => {
  const annotationTypes = getAnnotationTypes(selectedAnnotations);
  const toolNames = annotationTypes?.length >= 1 ? annotationTypes : [currentTool.name];

  return getPanelFromNames(toolNames);
};
