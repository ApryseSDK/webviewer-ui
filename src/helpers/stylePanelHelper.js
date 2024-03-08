import core from 'core';

const Tools = window.Core.Tools;

export const shouldHideStylePanelOptions = (toolName) => {
  const toolsNoStylePanelOptions = [
    Tools.CheckBoxFormFieldCreateTool,
    Tools.RadioButtonFormFieldCreateTool,
    Tools.AddParagraphTool,
    Tools.AddImageContentTool,
    Tools.CropCreateTool,
    Tools.SnippingCreateTool,
    Tools.SignatureFormFieldCreateTool,
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

export const shouldHideFillColorAndCollapsablePanelSections = (toolName) => {
  const toolsWithHiddenFillColorSections = [
    Tools.SignatureFormFieldCreateTool,
    Tools.RubberStampCreateTool,
    Tools.StampCreateTool,
    Tools.EraserTool,
  ];
  return toolsWithHiddenFillColorSections.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideStrokeSlider = (toolName) => {
  const toolsWithHiddenStrokeSlider = [
    Tools.TextUnderlineCreateTool,
    Tools.TextHighlightCreateTool,
    Tools.TextSquigglyCreateTool,
    Tools.TextStrikeoutCreateTool,
    Tools.CountMeasurementCreateTool,
    Tools.RubberStampCreateTool,
    Tools.FileAttachmentCreateTool,
    Tools.StampCreateTool,
    Tools.StickyCreateTool,
    Tools.MarkInsertTextCreateTool,
    Tools.MarkReplaceTextCreateTool,
  ];
  return toolsWithHiddenStrokeSlider.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideStrokeStyle = (toolName) => {
  const toolsWithHiddenStrokeStyle = [
    Tools.RubberStampCreateTool,
    Tools.StampCreateTool,
    Tools.EraserTool,
  ];
  return toolsWithHiddenStrokeStyle.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldShowTextStyle = (toolName) => {
  const toolsWithHiddenStrokeSlider = [
    Tools.FreeTextCreateTool,
    Tools.CalloutCreateTool,
    Tools.RedactionCreateTool,
    Tools.TextFormFieldCreateTool,
    Tools.ListBoxFormFieldCreateTool,
    Tools.ComboBoxFormFieldCreateTool,
  ];
  return toolsWithHiddenStrokeSlider.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideOpacitySlider = (toolName) => {
  const toolsWithHiddenOpacitySlider = [
    Tools.RedactionCreateTool,
    Tools.EraserTool,
    Tools.TextFormFieldCreateTool,
    Tools.ListBoxFormFieldCreateTool,
    Tools.ComboBoxFormFieldCreateTool,
    Tools.SignatureFormFieldCreateTool,
  ];
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

export const extractUniqueFontFamilies = (jsonData, inputText) => {
  const uniqueFontFamilies = new Set();
  const uniqueFontSizes = new Set();

  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      const index = parseInt(key, 10);
      if (!isNaN(index) && inputText[index] !== ' ' && jsonData[key]['font-family']) {
        uniqueFontFamilies.add(jsonData[key]['font-family'].trim());
      }
      if (!isNaN(index) && inputText[index] !== ' ' && jsonData[key]['font-size']) {
        uniqueFontSizes.add(jsonData[key]['font-size'].trim());
      }
    }
  }

  return {
    fonts: Array.from(uniqueFontFamilies),
    sizes: Array.from(uniqueFontSizes),
  };
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

export const shouldHideTextStylePicker = (toolName) => {
  const { ToolNames } = window.Core.Tools;
  const toolsWithHiddenTextStylePicker = [
    ToolNames.TEXT_FORM_FIELD,
    ToolNames.LIST_BOX_FIELD,
    ToolNames.COMBO_BOX_FIELD,
  ];
  return toolsWithHiddenTextStylePicker.includes(toolName);
};
