import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import TextStylePicker from './TextStylePicker';
import core from 'core';

export default {
  title: 'Components/TextStylePicker',
  component: TextStylePicker,
};

const noop = () => {};

const state = {
  ...initialState,
  viewer: {
    currentLanguage: 'ja',
    disabledElements: {},
    customElementOverrides: {}
  }
};
const store = configureStore({
  reducer: () => state
});

const BasicComponent = (props) => {
  return (
    <I18nextProvider i18n={i18n.cloneInstance({ lng: 'ja', fallbackLng: 'ja' })}>
      <Provider store={store}>
        <div style={ { width: '220px', padding: '12px 12px' } }>
          <TextStylePicker {...props}/>
        </div>
      </Provider>
    </I18nextProvider>
  );
};

const DisabledFontSelectorComponent = (props) => {
  return (
    <I18nextProvider i18n={i18n.cloneInstance({ lng: 'ja', fallbackLng: 'ja' })}>
      <Provider store={store}>
        <div style={ { width: '220px', padding: '12px 12px' } }>
          <TextStylePicker {...props}/>
        </div>
      </Provider>
    </I18nextProvider>
  );
};

export const TextStylePickerSection = BasicComponent.bind({});
TextStylePickerSection.args = {
  properties: {
    FontSize: '128'
  },
  isRedaction: false,
  onPropertyChange: noop
};

export const TextStylePickerFreeTextDisabled = DisabledFontSelectorComponent.bind({});
TextStylePickerFreeTextDisabled.args = {
  properties: {
    FontSize: '128'
  },
  isFreeText: true,
  isFreeTextAutoSize: true,
  isRedaction: false,
  onPropertyChange: noop
};

export const TextStylePickerFreeTextEnabled = DisabledFontSelectorComponent.bind({});
TextStylePickerFreeTextEnabled.args = {
  properties: {
    FontSize: '128'
  },
  isFreeText: true,
  isFreeTextAutoSize: false,
  isRedaction: false,
  onPropertyChange: noop
};