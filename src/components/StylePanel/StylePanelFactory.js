import FreeTextStylePanel from './panels/FreeTextStylePanel';
import DefaultStylePanel from './panels/DefaultStylePanel';

const { ToolNames } = window.Core.Tools;

const panelMap = {
  [ToolNames.FREETEXT]: FreeTextStylePanel,
};

export const getStylePanelComponent = (currentTool, selectedAnnotations) => {
  const annotationTool = selectedAnnotations?.length === 1 ? selectedAnnotations[0].ToolName : null;
  const toolName = annotationTool || currentTool.name;

  return panelMap[toolName] || DefaultStylePanel;
};
