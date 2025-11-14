import React, { useEffect, useState } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import StylePopup from '.';
import core from 'core';
import { createStore } from 'helpers/storybookHelper';
import '../HeaderItems/HeaderItems.scss';
import { within, expect, userEvent } from 'storybook/test';

export default {
  title: 'Components/StylePopup',
  component: StylePopup,
};

// Mock some state to show the style popups
const state = {
  ...initialState,
  viewer: {
    openElements: {
      stylePopup: true,
      stylePopupTextStyleContainer: true,
      stylePopupColorsContainer: true,
      stylePopupLabelTextContainer: true
    },
    disabledElements: {},
    selectedScale: undefined,
    colorMap: {
      textField: {
        currentStyleTab: 'StrokeColor',
        iconColor: 'StrokeColor',
      }
    },
    fonts: ['Helvetica', 'Times New Roman', 'Arimo'],
    snapMode: {},
    customElementOverrides: {}
  }
};

const noop = () => { };

const store = configureStore({
  reducer: () => state
});

const BasicComponent = (props) => {
  core.getFormFieldCreationManager = () => ({
    isInFormFieldCreationMode: () => true,
  });

  return (
    <Provider store={store}>
      <StylePopup {...props} />
    </Provider>
  );
};

export const StylePopupInFormBuilder = BasicComponent.bind({});
StylePopupInFormBuilder.args = {
  currentStyleTab: 'StrokeColor',
  isInFormBuilderAndNotFreeText: true,
  style: {
    'FillColor': new window.Core.Annotations.Color(212, 211, 211),
    'StrokeColor': new window.Core.Annotations.Color(0, 0, 0),
    'TextColor': new window.Core.Annotations.Color(0, 0, 0),
    'Opacity': null,
    'StrokeThickness': 1,
    'FontSize': '12pt',
    'Style': 'solid'
  },
  colorMapKey: 'textField',
  colorPalette: 'StrokeColor',
  disableSeparator: true,
  hideSnapModeCheckbox: true,
  isFreeText: false,
  isEllipse: false,
  isTextStyleContainerActive: true,
  isLabelTextContainerActive: true,
  properties: {
    'StrokeStyle': 'solid',
  },
  isRedaction: false,
  fonts: ['Helvetica', 'Times New Roman', 'Arimo'],
  isSnapModeEnabled: false,
  onSliderChange: noop,
  onStyleChange: noop,
  closeElement: noop,
  openElement: noop,
  onPropertyChange: noop,
  onRichTextStyleChange: noop,
  onLineStyleChange: noop,
};

StylePopupInFormBuilder.parameters = window.storybook.disableRtlMode;

export const StylePopupForRedactionToolInHeaderItem = () => {
  const props = {
    currentStyleTab: 'TextColor',
    isInFormBuilderAndNotFreeText: false,
    style: {
      'FillColor': new window.Core.Annotations.Color(212, 211, 211),
      'StrokeColor': new window.Core.Annotations.Color(0, 0, 0),
      'TextColor': new window.Core.Annotations.Color(0, 0, 0),
      'Opacity': null,
      'StrokeThickness': 1,
      'FontSize': '12pt',
      'Style': 'solid'
    },
    colorMapKey: 'textField',
    colorPalette: 'TextColor',
    disableSeparator: true,
    hideSnapModeCheckbox: true,
    isFreeText: false,
    isEllipse: false,
    isTextStyleContainerActive: true,
    isLabelTextContainerActive: true,
    properties: {
      'StrokeStyle': 'solid',
    },
    isRedaction: true,
    fonts: ['Helvetica', 'Times New Roman', 'Arimo'],
    isSnapModeEnabled: false,
    onSliderChange: noop,
    onStyleChange: noop,
    closeElement: noop,
    openElement: noop,
    onPropertyChange: noop,
    onRichTextStyleChange: noop,
    onLineStyleChange: noop,
  };

  const stateForTextTab = {
    ...state,
    viewer: {
      ...state.viewer,
      colorMap: {
        textField: {
          currentStyleTab: 'TextColor',
          iconColor: 'TextColor',
        }
      },
    }
  };

  const store = configureStore({
    reducer: () => stateForTextTab
  });

  return (
    <Provider store={store}>
      <div className="HeaderItems">
        <StylePopup {...props} />
      </div>
    </Provider>
  );
};

StylePopupForRedactionToolInHeaderItem.parameters = window.storybook.disableRtlMode;


export const StylePopupForDistanceMeasurementToolInHeaderItem = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const props = {
    toolName: 'AnnotationCreateDistanceMeasurement',
    colorMapKey: 'distanceMeasurement',
    style: {
      StrokeColor: new window.Core.Annotations.Color(212, 211, 211),
      FillColor: new window.Core.Annotations.Color(0, 0, 0),
      StrokeThickness: 1,
      Opacity: 1,
      StartLineStyle: 'OpenArrow',
      EndLineStyle: 'OpenArrow',
      StrokeStyle: 'solid',
      measurementCaptionOptions: {
        isEnabled: true,
        captionRect: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0
        },
        captionStyle: {
          fontFamily: 'sans-serif',
          color: '',
          staticSize: '0pt',
          maximumSize: '0pt'
        }
      },
      initProps: {
        measurementCaptionOptions: 'measurementCaptionOptions',
        calculateCurrentCaptionSize: 'calculateCurrentCaptionSize',
        setCaptionStyle: 'setCaptionStyle',
        getDefaultCaptionRect: 'getDefaultCaptionRect',
        setDefaultCaptionRect: 'setDefaultCaptionRect',
        getCaptionTopAndLeft: 'getCaptionTopAndLeft',
        isCaptionRectValid: 'isCaptionRectValid',
        drawMeasurementCaption: 'drawMeasurementCaption',
        getCustomAppearance: 'getCustomAppearance',
        getMeasurementText: 'getMeasurementText',
        setMeasurementCaptionOptions: 'setMeasurementCaptionOptions',
        getMeasurementCaptionOptions: 'getMeasurementCaptionOptions',
        isUnitCanBeTransferToImperialMark: 'isUnitCanBeTransferToImperialMark',
        Precision: 'Precision',
        Scale: 'Scale',
        System: 'System',
        DisplayFormat: 'DisplayFormat',
        DisplayUnits: 'DisplayUnits'
      },
      Precision: 0.1,
      Scale: [
        [
          1,
          'in'
        ],
        [
          1,
          'in'
        ]
      ]
    },
    isFreeText: false,
    isEllipse: false,
    hideSnapModeCheckbox: false,
    properties: {
      StartLineStyle: 'OpenArrow',
      EndLineStyle: 'OpenArrow',
      StrokeStyle: 'solid'
    },
    isRedaction: false,
    showLineStyleOptions: true,
    isMobile: false,
    currentStyleTab: 'StrokeColor',
    isFontSizeSliderDisabled: false,
    isTextStyleContainerActive: true,
    isColorsContainerActive: false,
    isLabelTextContainerActive: true,
    fonts: [
      'Helvetica',
      'Times New Roman',
      'Arimo',
      'Caladea',
      'Carlito',
      'Cousine',
      'Liberation Serif',
      'Open Sans',
      'Roboto',
      'Roboto Mono',
      'Tinos'
    ],
    isSnapModeEnabled: false,
    isInFormBuilderAndNotFreeText: false,
    onStyleChange: noop,
    onSliderChange: noop,
    closeElement: noop,
    openElement: noop,
    onPropertyChange: noop,
    onRichTextStyleChange: noop,
    onLineStyleChange: noop,
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

  useEffect(() => {
    const oldGetToolMode = core.getToolMode;
    const oldGetToolModeMap = core.getToolModeMap;
    const newTool = new window.Core.Tools.DistanceMeasurementCreateTool();
    newTool.name = props.toolName;
    newTool.defaults = props.style;

    core.getToolMode = () => newTool;
    core.getToolModeMap = () => ({ [props.toolName]: newTool });

    const oldGetTool = core.getTool;
    core.getTool = () => newTool;

    setShouldRender(true);
    return () => {
      core.getToolMode = oldGetToolMode;
      core.getTool = oldGetTool;
      core.getToolModeMap = oldGetToolModeMap;
    };
  }, []);

  mockStore.dispatch({
    type: 'SET_ACTIVE_TOOL_NAME',
    payload: { toolName: props.toolName },
  });
  return shouldRender ?
    (
      <Provider store={mockStore}>
        <div className="HeaderItems">
          <StylePopup {...props} />
        </div>
      </Provider>
    ) : <>Loading...</>;
};

StylePopupForDistanceMeasurementToolInHeaderItem.parameters = window.storybook.disableRtlMode;

StylePopupForDistanceMeasurementToolInHeaderItem.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const checkbox = await canvas.findByRole('checkbox', { name: 'Enable snapping for measurement tools' });
  expect(checkbox).toBeInTheDocument();
  expect(checkbox.checked).toBe(true);
  await userEvent.click(checkbox);
  expect(checkbox.checked).toBe(false);
};
export const StylePopupForFreeTextToolInHeaderItem = () => {
  const props = {
    currentStyleTab: 'TextColor',
    isInFormBuilderAndNotFreeText: false,
    style: {
      'FillColor': new window.Core.Annotations.Color(212, 211, 211),
      'StrokeColor': new window.Core.Annotations.Color(0, 0, 0),
      'TextColor': new window.Core.Annotations.Color(0, 0, 0),
      'Opacity': 1,
      'StrokeThickness': 1,
      'FontSize': '12pt',
      'Style': 'solid'
    },
    colorMapKey: 'textField',
    colorPalette: 'TextColor',
    disableSeparator: true,
    hideSnapModeCheckbox: true,
    isFreeText: true,
    isEllipse: false,
    isTextStyleContainerActive: true,
    isLabelTextContainerActive: false,
    properties: {
      'StrokeStyle': 'solid',
    },
    fonts: ['Helvetica', 'Times New Roman', 'Arimo'],
    isSnapModeEnabled: false,
    onSliderChange: noop,
    onStyleChange: noop,
    closeElement: noop,
    openElement: noop,
    onPropertyChange: noop,
    onRichTextStyleChange: noop,
    onLineStyleChange: noop,
  };

  const stateForTextTab = {
    ...state,
    viewer: {
      ...state.viewer,
      colorMap: {
        textField: {
          currentStyleTab: 'TextColor',
          iconColor: 'TextColor',
        }
      },
    }
  };

  const store = configureStore({
    reducer: () => stateForTextTab
  });

  return (
    <Provider store={store}>
      <div className="HeaderItems">
        <StylePopup {...props} />
      </div>
    </Provider>
  );
};

StylePopupForFreeTextToolInHeaderItem.parameters = window.storybook.disableRtlMode;
