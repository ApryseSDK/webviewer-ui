import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import PresetButton from './PresetButton';
import { PRESET_BUTTON_TYPES, CELL_ADJUSTMENT_BUTTONS } from 'src/constants/customizationVariables';
import { expect, within } from 'storybook/test';
import core from 'core';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/PresetButton',
  component: PresetButton,
};


const prepareButtonStory = (buttonType, className, style) => {
  const props = {
    buttonType: buttonType,
    className: className,
    style: style,
  };

  const mockInitialState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeDocumentViewerKey: 1,
    },
  };
  const store = configureStore({ reducer: () => mockInitialState });

  return (
    <Provider store={store}>
      <PresetButton {...props} />
    </Provider>
  );
};

export const ModularUIPresetButtons = () => {
  const mockInitialState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeDocumentViewerKey: 1,
    },
  };
  const store = configureStore({ reducer: () => mockInitialState });
  return (
    <Provider store={store}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {Object.values(PRESET_BUTTON_TYPES).map((buttonType) => (
          <PresetButton key={buttonType} buttonType={buttonType} />
        ))}
      </div>

    </Provider>
  );
};

ModularUIPresetButtons.parameters = window.storybook.disableRtlMode;

export const ModularUIPresetButtonsWithStyle = () => {
  const mockInitialState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeDocumentViewerKey: 1,
    },
  };
  const store = configureStore({ reducer: () => mockInitialState });

  return (
    <Provider store={store}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px' }}>
        {Object.values(PRESET_BUTTON_TYPES).map((buttonType) => (
          <PresetButton
            key={buttonType}
            buttonType={buttonType}
            className={`${buttonType}-button-class`}
            style={{ borderRadius: '15px', border: '2px solid black' }}
          />
        ))}
      </div>
    </Provider>
  );
};

ModularUIPresetButtonsWithStyle.parameters = window.storybook.disableRtlMode;

let eventList = [];
let inMode = true;
let resolver;
let promise = new Promise((resolve) => resolver = resolve);

export function FormFieldEditToggle() {
  eventList = [];
  inMode = true;
  resolver = null;
  promise = new Promise((resolve) => resolver = resolve);
  const originalFunc = core.getFormFieldCreationManager;
  const addToEvents = (func) => {
    eventList.push(func);
    if (eventList.length > 1) {
      resolver();
    }
  };
  core.getFormFieldCreationManager = () => ({
    addEventListener: (_, func) => addToEvents(func),
    removeEventListener: (_, func) => eventList.splice(eventList.indexOf(func), 1),
    isInFormFieldCreationMode: () => inMode,
  });
  useEffect(() => {
    return () => core.getFormFieldCreationManager = originalFunc;
  }, []);
  return prepareButtonStory(PRESET_BUTTON_TYPES.FORM_FIELD_EDIT);
}

FormFieldEditToggle.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', { name: getTranslatedText('action.formFieldEditMode') });
  await expect(button.ariaPressed).toBe('true');
  // Ensure it updates states from the event
  inMode = false;
  await promise;
  eventList[0]();
  await expect(button.ariaPressed).toBe('false');
};

FormFieldEditToggle.parameters = window.storybook.disableRtlMode;


export function ContentEditToggle() {
  eventList = [];
  inMode = true;
  resolver = null;
  promise = new Promise((resolve) => resolver = resolve);
  const originalFunc = core.getContentEditManager;
  const addToEvents = (func) => {
    eventList.push(func);
    if (eventList.length > 1) {
      resolver();
    }
  };
  core.getContentEditManager = () => ({
    addEventListener: (_, func) => addToEvents(func),
    removeEventListener: (_, func) => eventList.splice(eventList.indexOf(func), 1),
    isInContentEditMode: () => inMode,
  });
  useEffect(() => {
    return () => core.getContentEditManager = originalFunc;
  }, []);
  return prepareButtonStory(PRESET_BUTTON_TYPES.CONTENT_EDIT);
}

ContentEditToggle.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', { name: /Edit Content/i });
  await expect(button.ariaPressed).toBe('true');
  // Ensure it updates states from the event
  inMode = false;
  await promise;
  eventList[0]();
  await expect(button.ariaPressed).toBe('false');
};

ContentEditToggle.parameters = window.storybook.disableRtlMode;

export function CellAdjustmentButtons() {
  const mockInitialState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeDocumentViewerKey: 1,
    },
  };
  const store = configureStore({ reducer: () => mockInitialState });
  return (
    <Provider store={store}>
      {Object.values(CELL_ADJUSTMENT_BUTTONS).map((buttonType) =>
        <PresetButton buttonType={buttonType}
          key={buttonType} />)}
    </Provider>
  );
}

CellAdjustmentButtons.parameters = window.storybook.disableRtlMode;
