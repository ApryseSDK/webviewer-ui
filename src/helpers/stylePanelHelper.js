import core from 'core';
import { useSelector, useDispatch } from 'react-redux';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';
import actions from 'actions';

const { Tools, Annotations } = window.Core;
const { ToolNames } = Tools;

export const shouldHideSharedStyleOptions = (toolName) => {
  const toolsWithNoSharedStyles = [
    Tools.RedactionCreateTool,
  ];

  return toolsWithNoSharedStyles.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideStrokeDropdowns = (toolName) => {
  const toolsWithNoStrokeDropdowns = [
    Tools.CountMeasurementCreateTool,
    Tools.FreeHandCreateTool,
    Tools.FreeHandHighlightCreateTool,
    Tools.ArcCreateTool,
    Tools.ArcMeasurementCreateTool,
  ];

  return toolsWithNoStrokeDropdowns.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideStylePanelOptions = (toolName) => {
  const toolsNoStylePanelOptions = [
    Tools.AddParagraphTool,
    Tools.AddImageContentTool,
    Tools.CropCreateTool,
    Tools.SnippingCreateTool,
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
    // ... form builder
    Tools.TextFormFieldCreateTool,
    Tools.RadioButtonFormFieldCreateTool,
    Tools.CheckBoxFormFieldCreateTool,
    Tools.ListBoxFormFieldCreateTool,
    Tools.ComboBoxFormFieldCreateTool
  ];

  return toolsWithCollapsedStylePanels.some((tool) => core.getTool(toolName) instanceof tool);
};

export const shouldHideFillColorAndCollapsablePanelSections = (toolName) => {
  const toolsWithHiddenFillColorSections = [
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

export const shouldHideCloudyLineStyle = (toolName) => {
  const toolsWithHiddenCloudyLineStyle = [
    Tools.EllipseCreateTool,
    Tools.LineCreateTool,
  ];
  return toolsWithHiddenCloudyLineStyle.some((tool) => core.getTool(toolName) instanceof tool);
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
    Tools.CheckBoxFormFieldCreateTool,
    Tools.RadioButtonFormFieldCreateTool
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

export const shouldRenderWidgetLayout = (toolName) => {
  const toolsWithHiddenTextStylePicker = [
    ToolNames.TEXT_FORM_FIELD,
    ToolNames.LIST_BOX_FIELD,
    ToolNames.COMBO_BOX_FIELD,
  ];
  return toolsWithHiddenTextStylePicker.includes(toolName);
};

export const isInstanceOfAny = (annotation, types) => {
  return types.some((type) => annotation instanceof type);
};

export const shouldShowNoStyles = (annotations, filteredTypes) => {
  return annotations.length === 1 && isInstanceOfAny(annotations[0], filteredTypes);
};

export const getAnnotationTypes = (selectedAnnotations) => {
  return selectedAnnotations.length >= 1
    ? Array.from(new Set(selectedAnnotations.map((annotation) => annotation.ToolName)))
    : null;
};

export const parseToolType = (selectedAnnotations, currentTool) => {
  const annotationTypes = getAnnotationTypes(selectedAnnotations);
  const toolName = annotationTypes?.length > 0 ? annotationTypes[0] : currentTool.name;

  const isRedaction =
    annotationTypes?.length === 1 && annotationTypes[0] === ToolNames.REDACTION ||
    toolName === ToolNames.REDACTION;
  const isStamp = annotationTypes?.includes(ToolNames.STAMP) || toolName === ToolNames.STAMP;
  const isWidget = selectedAnnotations.some((annotation) => annotation instanceof Annotations.WidgetAnnotation) || shouldRenderWidgetLayout(currentTool.name);
  const isInFormFieldCreationMode = core.getFormFieldCreationManager().isInFormFieldCreationMode();
  const isFreeText = toolName === ToolNames.FREE_TEXT;

  return {
    toolName,
    isRedaction,
    isStamp,
    isWidget,
    isInFormFieldCreationMode,
    isFreeText,
    activeTool: toolName,
    annotationTypes,
  };
};

export const useStylePanelSections = () => {
  const dispatch = useDispatch();
  const isSnapModeEnabled = useSelector(selectors.isSnapModeEnabled);
  const isStyleOptionDisabled = useSelector((state) => selectors.isElementDisabled(state, DataElements.STYLE_OPTION));
  const isStrokeStyleContainerActive = useSelector((state) => selectors.isElementOpen(state, DataElements.STROKE_STYLE_CONTAINER));
  const isFillColorContainerActive = useSelector((state) => selectors.isElementOpen(state, DataElements.FILL_COLOR_CONTAINER));
  const isOpacityContainerActive = useSelector((state) => selectors.isElementOpen(state, DataElements.OPACITY_CONTAINER));
  const isTextStyleContainerActive = useSelector((state) => selectors.isElementOpen(state, DataElements.RICH_TEXT_STYLE_CONTAINER));

  const panelItems = {
    [DataElements.STROKE_STYLE_CONTAINER]: isStrokeStyleContainerActive,
    [DataElements.FILL_COLOR_CONTAINER]: isFillColorContainerActive,
    [DataElements.OPACITY_CONTAINER]: isOpacityContainerActive,
    [DataElements.RICH_TEXT_STYLE_CONTAINER]: isTextStyleContainerActive,
  };

  const togglePanelItem = (dataElement) => {
    if (!panelItems[dataElement]) {
      dispatch(actions.openElement(dataElement));
    } else {
      dispatch(actions.closeElement(dataElement));
    }
  };
  const openTextStyleContainer = () => {
    dispatch(actions.openElements(DataElements.RICH_TEXT_EDITOR));
    togglePanelItem(DataElements.RICH_TEXT_STYLE_CONTAINER);
  };
  const openStrokeStyleContainer = () => togglePanelItem(DataElements.STROKE_STYLE_CONTAINER);
  const openFillColorContainer = () => togglePanelItem(DataElements.FILL_COLOR_CONTAINER);
  const openOpacityContainer = () => togglePanelItem(DataElements.OPACITY_CONTAINER);

  return {
    isSnapModeEnabled,
    isStyleOptionDisabled,
    isStrokeStyleContainerActive,
    isFillColorContainerActive,
    isOpacityContainerActive,
    isTextStyleContainerActive,
    openTextStyleContainer,
    openStrokeStyleContainer,
    openFillColorContainer,
    openOpacityContainer,
  };
};
