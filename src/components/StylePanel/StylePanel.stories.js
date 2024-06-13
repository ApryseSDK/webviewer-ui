import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import StylePanelContainer from './StylePanelContainer';
import initialState from 'src/redux/initialState';
import Panel from 'components/Panel';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import core from 'core';
import { MockApp, createStore } from 'helpers/storybookHelper';

export default {
  title: 'ModularComponents/StylePanel',
  component: StylePanelContainer,
  parameters: {
    customizableUI: true,
  }
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
  }
};

const StylePanelTemplate = ({ mockState = basicMockState, location = 'left' }) => (
  <Provider store={createStore(mockState)}>
    <Panel location={location} dataElement={'stylePanel'} isCustom>
      <StylePanelContainer />
    </Panel>
  </Provider>
);

const EmptyStylePanel = (location) => {
  return <StylePanelTemplate location={location}/>;
};

export const EmptyStylePanelOnTheLeft = () => EmptyStylePanel('left');
export const EmptyStylePanelOnTheRight = () => EmptyStylePanel('right');

const StylePanelInApp = (location) => {
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
      activeCustomRibbon: 'annotations-ribbon-item',
      lastPickedToolForGroupedItems: {
        'annotateGroupedItems': 'AnnotationEdit',
      },
      lastPickedToolAndGroup: {
        tool: 'AnnotationEdit',
        group: ['annotateGroupedItems'],
      },
      activeGroupedItems: ['annotateGroupedItems'],
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  const store = createStore(mockState);
  setItemToFlyoutStore(store);

  return <MockApp initialState={mockState} />;
};

export const StylePanelInAppLeft = () => StylePanelInApp('left');
export const StylePanelInAppRight = () => StylePanelInApp('right');
export const StylePanelInAppMobileVersion = () => StylePanelInApp();

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
    const newTool = new toolClass();
    newTool.name = toolName;
    newTool.defaults = {
      StrokeThickness: 1,
      Opacity: 1,
      FillColor: '#e44234',
      StrokeColor: '#e44234',
      TextColor: '#000000',
      ...defaults,
    };
    core.getToolMode = () => newTool;

    const oldGetTool = core.getTool;
    core.getTool = () => newTool;

    setRender(true);
    return () => {
      core.getToolMode = oldGetToolMode;
      core.getTool = oldGetTool;
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
export const StylePanelArcMeasurementTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.ArcMeasurementCreateTool, window.Core.Tools.ToolNames.ARC_MEASUREMENT, setShouldRender, {
    Scale: 1,
    Precision: 0.1,
  });
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
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
export const StylePanelButtonFormTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.CheckBoxFormFieldCreateTool, window.Core.Tools.ToolNames.CHECK_BOX_FIELD, setShouldRender);
  return shouldRender ? <StylePanelTemplate/> : <>Loading...</>;
};
export const StylePanelListBoxFormTool = () => {
  const [shouldRender, setShouldRender] = useState(false);
  useToolHook(window.Core.Tools.ListBoxFormFieldCreateTool, window.Core.Tools.ToolNames.LIST_BOX_FIELD, setShouldRender, {
    FontSize: '12px',
  });
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

export const StylePanelFreeTextToolMobileVersion = StylePanelTextTool;
StylePanelFreeTextToolMobileVersion.parameters = window.storybook.MobileParameters;