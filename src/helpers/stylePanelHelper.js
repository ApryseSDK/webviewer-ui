
import core from 'core';

const Tools = window.Core.Tools;

export const shouldHideStylePanelOptions = (toolName) => {
  const toolsNoStylePanelOptions = [
    Tools.SignatureFormFieldCreateTool,
    Tools.CheckBoxFormFieldCreateTool,
    Tools.RadioButtonFormFieldCreateTool,
    Tools.AddParagraphTool,
    Tools.AddImageContentTool,
  ];

  return toolsNoStylePanelOptions.some((tool) => core.getTool(toolName) instanceof tool);
};

export const hasFillColorAndCollapsablePanelSections = (toolName) => {
  const toolsWithCollapsedStylePanels = [
    Tools.RectangleCreateTool,
    Tools.EllipseCreateTool,
    Tools.PolygonCreateTool,
    Tools.PolygonCloudCreateTool,
    Tools.EllipseMeasurementCreateTool,
    Tools.AreaMeasurementCreateTool,
    Tools.FreeTextCreateTool,
    Tools.CalloutCreateTool,
    Tools.RedactionCreateTool,
  ];

  return toolsWithCollapsedStylePanels.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideStrokeSlider = (toolName) => {
  const toolsWithHiddenStrokeSlider = [
    Tools.TextUnderlineCreateTool,
    Tools.TextHighlightCreateTool,
    Tools.TextSquigglyCreateTool,
    Tools.TextStrikeoutCreateTool,
    Tools.CountMeasurementCreateTool,
    Tools.RubberStampCreateTool,
  ];
  return toolsWithHiddenStrokeSlider.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldShowTextStyle = (toolName) => {
  const toolsWithHiddenStrokeSlider = [
    Tools.FreeTextCreateTool,
    Tools.CalloutCreateTool,
    Tools.RedactionCreateTool,
  ];
  return toolsWithHiddenStrokeSlider.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideOpacitySlider = (toolName) => {
  const toolsWithHiddenOpacitySlider = [Tools.TextFormFieldCreateTool, Tools.RedactionCreateTool];
  return toolsWithHiddenOpacitySlider.some((tool) => core.getTool(toolName) instanceof tool);
};

export const hasSnapModeCheckbox = (toolName) => {
  const toolsWithSnapModeCheckbox = [
    Tools.DistanceMeasurementCreateTool,
    Tools.ArcMeasurementCreateTool,
    Tools.PerimeterMeasurementCreateTool,
    Tools.AreaMeasurementCreateTool,
    Tools.RectangularAreaMeasurementCreateTool,
    Tools.CloudyRectangularAreaMeasurementCreateTool,
  ];
  return toolsWithSnapModeCheckbox.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideTransparentFillColor = (toolName) => {
  const toolsWithHiddenTransparentColor = [Tools.RedactionCreateTool];
  return toolsWithHiddenTransparentColor.some((tool) => core.getTool(toolName) instanceof tool);
};

export const stylePanelSectionTitles = (toolName, section) => {
  const toolTitles = {
    'AnnotationCreateRedaction': {
      'Title': 'component.redaction',
      'StrokeColor': 'stylePanel.headings.redactionMarkOutline',
      'FillColor': 'stylePanel.headings.redactionFill',
    },
  };
  return toolTitles[toolName] && toolTitles[toolName][section];
};