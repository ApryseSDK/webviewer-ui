import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import StylePopup from '.';
import core from 'core';
import '../HeaderItems/HeaderItems.scss';

export default {
  title: 'Components/StylePopup',
  component: StylePopup,
};

// Mock some state to show the style popups
const state = {
  ...initialState,
  viewer: {
    openElements: {
      watermarkPanel: true,
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
    isSnapModeEnabled: false,
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
