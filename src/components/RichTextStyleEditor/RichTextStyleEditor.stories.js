import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import RichTextStyleEditor from './RichTextStyleEditor';
import Panel from '../Panel';
import '../StylePicker/StylePicker.scss';
import { initialTextColors } from 'helpers/initialColorStates';

export default {
  title: 'Components/RichTextStyleEditor',
  component: RichTextStyleEditor,
};
const noop = () => {};

// Mock some state to show the style popups
const state = {
  ...initialState,
  viewer: {
    openElements: {
      stylePopup: true,
      stylePanel: true,
      stylePopupTextStyleContainer: true,
      stylePopupColorsContainer: true,
      stylePopupLabelTextContainer: true,
      panel: true,
      header: true,
    },
    selectedScale: undefined,
    colorMap: {
      textField: {
        currentStyleTab: 'StrokeColor',
        iconColor: 'StrokeColor',
      }
    },
    fonts: ['Helvetica', 'Times New Roman', 'Arimo'],
    isSnapModeEnabled: false,
    customElementOverrides: {},
    panelWidths: { panel: 264 },
    /* eslint-disable custom/no-hex-colors */
    colors: [
      '#fdac0f', '#fa9933', '#f34747', '#21905b', '#c531a4',
      '#e5631a', '#3e5ece', '#dc9814', '#c27727', '#b11c1c',
      '#13558c', '#76287b', '#347842', '#318f29', '#ffffff',
      '#cdcdcd', '#9c9c9c', '#696969', '#272727', '#000000'
    ],
    /* eslint-enable custom/no-hex-colors */
    textColors: initialTextColors,
    toolColorOverrides: {},
    disabledElements: {
      logoBar: { disabled: true },
    },
    sortStrategy: 'position',
    isInDesktopOnlyMode: true,
    modularHeaders: {}
  }
};

const baseProps = {
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

const baseObject = {
  annotation: '',
  editor: {},
  style: {},
  isFreeTextAutoSize: false,
  onFreeTextSizeToggle: () => {},
  onPropertyChange: () => {},
  onRichTextStyleChange: () => {},
};


const store = configureStore({
  reducer: () => state
});

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <Panel dataElement="panel" location="left">
        <div className="StylePicker">
          <RichTextStyleEditor {...props} />
        </div>
      </Panel>
    </Provider>
  );
};

export const Basic = BasicComponent.bind({
  ...baseObject
});
Basic.args = {
  ...baseProps,
  isRedaction: false,
};
Basic.parameters = window.storybook.disableRtlMode;

export const WidgetLayout = BasicComponent.bind({
  ...baseObject
});
WidgetLayout.args = {
  ...baseProps,
  isWidget: true,
  isRedaction: false,
};
WidgetLayout.parameters = window.storybook.disableRtlMode;

export const RedactionLayout = BasicComponent.bind({
  ...baseObject
});
RedactionLayout.args = {
  ...baseProps,
  isRedaction: true,
  isContentEditing: false,
};
RedactionLayout.parameters = window.storybook.disableRtlMode;