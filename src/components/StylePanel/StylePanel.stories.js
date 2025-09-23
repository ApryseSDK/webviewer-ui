import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import StylePanelContainer from './StylePanelContainer';
import initialState from 'src/redux/initialState';
import Panel from 'components/Panel';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import core from 'core';
import { MockApp, createStore, waitForTimeout } from 'helpers/storybookHelper';
import { initialColors, initialTextColors } from 'helpers/initialColorStates';
import { within, userEvent, expect, waitFor } from 'storybook/test';

export default {
  title: 'ModularComponents/StylePanel',
  component: StylePanelContainer,
};

const basicMockState = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    openElements: {
      stylePanel: true,
      strokeStyleContainer: true,
      fillColorContainer: true,
      opacityContainer: true,
      richTextStyleContainer: true,
    },
  },
  featureFlags: {
    customizableUI: true,
  },
};

const mockStore = createStore(basicMockState);

const StylePanelTemplate = ({ mockState = basicMockState, location = 'left' }) => (
  <Provider store={mockStore}>
    <Panel location={location} dataElement={'stylePanel'} isCustom>
      <StylePanelContainer dataElement="stylePanel" />
    </Panel>
  </Provider>
);

const EmptyStylePanel = (location) => {
  return <StylePanelTemplate location={location}/>;
};

export const EmptyStylePanelOnTheLeft = () => EmptyStylePanel('left');
export const EmptyStylePanelOnTheRight = () => EmptyStylePanel('right');

const StylePanelInApp = (context, location) => {
  const mockState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      modularHeaders: mockHeadersNormalized,
      modularComponents: mockModularComponents,
      isInDesktopOnlyMode: true,
      genericPanels: [{
        dataElement: 'stylePanel',
        render: 'stylePanel',
        location: location,
      }],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        stylePanel: true,
      },
      activeCustomRibbon: 'toolbarGroup-Annotate',
      activeGroupedItems: ['annotateGroupedItems'],
      activeTheme: context.globals.theme,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={mockState} />;
};

export const StylePanelInAppLeft = (args, context) => StylePanelInApp(context, 'left');
export const StylePanelInAppRight = (args, context) => StylePanelInApp(context, 'right');
export const StylePanelInAppMobileVersion = (args, context) => StylePanelInApp(context);

StylePanelInAppLeft.parameters = {
  layout: 'fullscreen',
};
StylePanelInAppRight.parameters = {
  layout: 'fullscreen',
};
StylePanelInAppMobileVersion.parameters = window.storybook.MobileParameters;

const useToolHook = (toolClass, toolName, setRender, defaults = {}) => {
  useEffect(() => {
    const oldGetToolMode = core.getToolMode;
    const oldToolMap = core.getToolModeMap;
    const newTool = new toolClass();
    newTool.name = toolName;
    newTool.defaults = {
      StrokeThickness: 1,
      Opacity: 1,
      FillColor: initialColors[0],
      StrokeColor: initialColors[0],
      TextColor: initialTextColors[0],
      ...defaults,
    };
    core.getToolMode = () => newTool;
    core.getToolModeMap = () => ({
      [toolName]: newTool,
    });
    mockStore.dispatch({
      type: 'SET_ACTIVE_TOOL_NAME',
      payload: { toolName },
    });
    const oldGetTool = core.getTool;
    core.getTool = () => newTool;

    setRender(true);
    return () => {
      core.getToolMode = oldGetToolMode;
      core.getTool = oldGetTool;
      core.getToolModeMap = oldToolMap;
    };
  }, []);
};

const FreeTextDefaults = {
  StrokeStyle: 'solid',
  Font: 'Helvetica',
  FontSize: '12pt',
};
export const StylePanelShapeTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.RectangleCreateTool, window.Core.Tools.ToolNames.RECTANGLE, setShouldRender, {
    StrokeStyle: 'solid',
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelMarkupTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.TextHighlightCreateTool, window.Core.Tools.ToolNames.HIGHLIGHT, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelTextTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.FreeTextCreateTool, window.Core.Tools.ToolNames.FREETEXT, setShouldRender, FreeTextDefaults);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};

StylePanelTextTool.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const textStyleShowMoreButton = await canvas.findByLabelText('Text Style Show More Colors');
  const testStrokeStyleShowMoreButton = await canvas.findByLabelText('Stroke Show More Colors');
  await userEvent.click(textStyleShowMoreButton);
  await userEvent.click(testStrokeStyleShowMoreButton);

  await waitFor(async () => {
    expect(textStyleShowMoreButton.textContent).toBe('Show Less');
    expect(testStrokeStyleShowMoreButton.textContent).toBe('Show Less');
  });

  const textStyleColor = await canvas.findByRole('button', { name: `Text Style Color ${initialTextColors[0]}` });
  const strokeColor = await canvas.findByRole('button', { name: `Stroke Color ${initialTextColors[0]}` });
  await userEvent.click(await canvas.findByRole('button', { name: /^Text Style Delete Selected Color/i }));
  const textStyleColorButtons = await canvas.findAllByRole('button', { name: /^Text Style Color/i });
  const strokeColorButtons = await canvas.findAllByRole('button', { name: /^Stroke Color/i });

  expect(textStyleColorButtons.length).not.toEqual(strokeColorButtons.length);
  expect(textStyleColor).not.toBeInTheDocument();
  expect(strokeColor).toBeInTheDocument();
};

export const StylePanelFreeTextToolMobileVersion = StylePanelTextTool;
StylePanelFreeTextToolMobileVersion.parameters = window.storybook.MobileParameters;

export const StylePanelFreehandTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.FreeHandCreateTool, window.Core.Tools.ToolNames.FREEHAND, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelNoteTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.StickyCreateTool, window.Core.Tools.ToolNames.STICKY, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelArcTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.ArcMeasurementCreateTool, window.Core.Tools.ToolNames.ARC, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelLineTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.LineCreateTool, window.Core.Tools.ToolNames.LINE, setShouldRender, {
    StrokeStyle: 'solid',
    EndLineStyle: 'None',
    StartLineStyle: 'None',
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelFileAttachmentTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.FileAttachmentCreateTool, window.Core.Tools.ToolNames.FILEATTACHMENT, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelStampTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.StampCreateTool, window.Core.Tools.ToolNames.STAMP, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelRedactionTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.RedactionCreateTool, window.Core.Tools.ToolNames.REDACTION, setShouldRender, {
    Font: 'Helvetica',
    FontSize: '12pt',
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelDistanceTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.DistanceMeasurementCreateTool, window.Core.Tools.ToolNames.DISTANCE_MEASUREMENT, setShouldRender, {
    StrokeStyle: 'solid',
    EndLineStyle: 'None',
    StartLineStyle: 'None',
    Scale: 1,
    Precision: 0.1,
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};

StylePanelDistanceTool.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const checkbox = await canvas.findByRole('checkbox', { name: 'Enable snapping for measurement tools' });
  expect(checkbox).toBeInTheDocument();
  expect(checkbox.checked).toBe(true);
  await userEvent.click(checkbox);
  expect(checkbox.checked).toBe(false);
};
export const StylePanelArcMeasurementTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.ArcMeasurementCreateTool, window.Core.Tools.ToolNames.ARC_MEASUREMENT, setShouldRender, {
    Scale: 1,
    Precision: 0.1,
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
StylePanelArcMeasurementTool.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const checkbox = await canvas.findByRole('checkbox', { name: 'Enable snapping for measurement tools' });
  expect(checkbox).toBeInTheDocument();
  expect(checkbox.checked).toBe(true);
  await userEvent.click(checkbox);
  expect(checkbox.checked).toBe(false);
};
export const StylePanelAreaMeasurementTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.AreaMeasurementCreateTool, window.Core.Tools.ToolNames.AREA_MEASUREMENT, setShouldRender, {
    StrokeStyle: 'solid',
    Scale: 1,
    Precision: 0.1,
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
StylePanelAreaMeasurementTool.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const checkbox = await canvas.findByRole('checkbox', { name: 'Enable snapping for measurement tools' });
  expect(checkbox).toBeInTheDocument();
  expect(checkbox.checked).toBe(true);
  await userEvent.click(checkbox);
  expect(checkbox.checked).toBe(false);
};
export const StylePanelEllipseMeasurementTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.EllipseMeasurementCreateTool, window.Core.Tools.ToolNames.ELLIPSE_MEASUREMENT, setShouldRender, {
    StrokeStyle: 'solid',
    Scale: 1,
    Precision: 0.1,
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelCountMeasurementTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.CountMeasurementCreateTool, window.Core.Tools.ToolNames.COUNT_MEASUREMENT, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelEditPageTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.CropCreateTool, window.Core.Tools.ToolNames.CROP, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelContentEditTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.AddParagraphTool, window.Core.Tools.ToolNames.ADD_PARAGRAPH, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelEraserTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.EraserTool, window.Core.Tools.ToolNames.ERASER, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelSignatureFormTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.SignatureFormFieldCreateTool, window.Core.Tools.ToolNames.SIG_FORM_FIELD, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelTextFormTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.TextFormFieldCreateTool, window.Core.Tools.ToolNames.TEXT_FORM_FIELD, setShouldRender, {
    FontSize: '12px',
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelCheckboxButtonFormTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.CheckBoxFormFieldCreateTool, window.Core.Tools.ToolNames.CHECK_BOX_FIELD, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelRadioButtonFormTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.RadioButtonFormFieldCreateTool, window.Core.Tools.ToolNames.RADIO_FORM_FIELD, setShouldRender, {
    FontSize: '12px',
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelListBoxFormTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.ListBoxFormFieldCreateTool, window.Core.Tools.ToolNames.LIST_BOX_FIELD, setShouldRender, {
    FontSize: '12px',
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelComboBoxFormTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.ComboBoxFormFieldCreateTool, window.Core.Tools.ToolNames.COMBO_BOX_FIELD, setShouldRender, {
    FontSize: '12px',
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};

export const StylePanelTooltipOnColors = StylePanelShapeTool.bind({});

StylePanelTooltipOnColors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Required timeout to allow useEffect to run and render the story
  await waitForTimeout(100);
  // eslint-disable-next-line custom/no-hex-colors
  const button = (await canvas.findAllByLabelText('Stroke Color #E44234'))[0];
  await userEvent.hover(button);
  // Required timeout since tooltip shows after a delay
  await waitForTimeout(1000);
  await expect(await document.body.querySelector('.tooltip__content')).not.toBeNull();
};

export const toggleAllSectionsInShapeTool = StylePanelShapeTool.bind({});
toggleAllSectionsInShapeTool.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Wait for the style panel to be rendered
  await waitFor(() => {
    expect(canvas.getByRole('button', { name: /Stroke/i, expanded: true })).toBeInTheDocument();
  });

  //Reset the sections to fit the initial state of the style panel of the selected tool
  mockStore.dispatch({
    type: 'CLOSE_ELEMENT',
    payload: { dataElement: ['opacityContainer'] },
  });
  mockStore.dispatch({
    type: 'CLOSE_ELEMENT',
    payload: { dataElement: ['fillColorContainer'] },
  });

  const buttons = await canvas.getAllByText('Stroke');
  const strokeSectionToggleButton = buttons[0];
  await waitFor(() => {
    // expect the stroke section is expanded initially
    expect(strokeSectionToggleButton.getAttribute('aria-expanded')).toBe('true');
  });

  await userEvent.click(strokeSectionToggleButton);
  await waitFor(() => {
    // expect the stroke section is expanded initially
    expect(strokeSectionToggleButton.getAttribute('aria-expanded')).toBe('false');
  });

  const FillToggleButton = await canvas.getByText('Fill');
  await userEvent.click(FillToggleButton);
  await waitFor(() => {
    expect(FillToggleButton.getAttribute('aria-expanded')).toBe('true');
  });
  // eslint-disable-next-line custom/no-hex-colors
  const firstColorInColorPalette = await canvas.getByLabelText('Fill Color #E44234');
  expect(firstColorInColorPalette).toBeInTheDocument();

  const OpacityToggleButton = await canvas.getByText('Opacity');
  await userEvent.click(OpacityToggleButton);
  await waitFor(() => {
    expect(OpacityToggleButton.getAttribute('aria-expanded')).toBe('true');
    expect(canvas.getByRole('textbox', { name: /Opacity/i })).toBeInTheDocument();
  });
};

export const toggleAllSectionsInFreeTextTool = StylePanelTextTool.bind({});
toggleAllSectionsInFreeTextTool.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  // Wait for the style panel to be rendered
  await waitFor(() => {
    expect(canvas.getByText('Text Style')).toBeInTheDocument();
    expect(canvas.getByText('Text Style').getAttribute('aria-expanded')).toBe('true');
  });

  //Reset the sections to fit the initial state of the style panel of the selected tool
  mockStore.dispatch({
    type: 'CLOSE_ELEMENT',
    payload: { dataElement: ['strokeStyleContainer'] },
  });
  mockStore.dispatch({
    type: 'CLOSE_ELEMENT',
    payload: { dataElement: ['opacityContainer'] },
  });
  mockStore.dispatch({
    type: 'CLOSE_ELEMENT',
    payload: { dataElement: ['fillColorContainer'] },
  });

  let buttons = await canvas.getAllByText('Stroke');
  const strokeSectionToggleButton = buttons[0];
  await userEvent.click(strokeSectionToggleButton);
  await waitFor(async () => {
    // expect the stroke section is expanded initially
    buttons = await canvas.getAllByText('Stroke');
    expect(strokeSectionToggleButton.getAttribute('aria-expanded')).toBe('true');
    expect(buttons.length).toBe(2);
  });

  const FillToggleButton = await canvas.getByText('Fill');
  await userEvent.click(FillToggleButton);
  await waitFor(() => {
    expect(FillToggleButton.getAttribute('aria-expanded')).toBe('true');
    const colorPaletts = document.querySelectorAll('.ColorPalette');
    expect(colorPaletts.length).toBe(3);
  });

  const OpacityToggleButton = await canvas.getByText('Opacity');
  await userEvent.click(OpacityToggleButton);
  await waitFor(() => {
    expect(OpacityToggleButton.getAttribute('aria-expanded')).toBe('true');
    expect(canvas.getByRole('textbox', { name: /Opacity/i })).toBeInTheDocument();
  });
};
