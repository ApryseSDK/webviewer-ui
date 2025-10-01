import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LIST_OPTIONS } from 'src/constants/officeEditor';
import core from 'core';
import ListToggleButton from './ListToggleButton';
import { OEModularUIMockState } from 'src/helpers/storybookHelper';

export default {
  title: 'ModularComponents/OfficeEditor/ListToggleButton',
  component: ListToggleButton,
};

const initialState = OEModularUIMockState;

const store = configureStore({ reducer: () => initialState });

const prepareButtonStory = (listType) => {
  const props = {
    listType: listType,
  };

  core.getOfficeEditor = () => ({
    isTextSelected: () => false,
  });

  return (
    <Provider store={store}>
      <ListToggleButton {...props} />
    </Provider>
  );
};

export function InactiveOrderedListButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.listType = LIST_OPTIONS.Unordered; // set inactive state
  return prepareButtonStory(LIST_OPTIONS.Ordered);
}

InactiveOrderedListButton.parameters = window.storybook.disableRtlMode;

export function ActiveOrderedListButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.listType = LIST_OPTIONS.Ordered; // set active state
  return prepareButtonStory(LIST_OPTIONS.Ordered);
}

ActiveOrderedListButton.parameters = window.storybook.disableRtlMode;

export function InactiveOrderedListHover() {
  return prepareButtonStory(LIST_OPTIONS.Ordered);
}

InactiveOrderedListHover.parameters = {
  pseudo: { hover: true },
  ...window.storybook.disableRtlMode,
};

export function InactiveUnorderedListButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.listType = LIST_OPTIONS.Ordered; // set inactive state
  return prepareButtonStory(LIST_OPTIONS.Unordered);
}

InactiveUnorderedListButton.parameters = window.storybook.disableRtlMode;

export function ActiveUnorderedListButton() {
  initialState.officeEditor.cursorProperties.paragraphProperties.listType = LIST_OPTIONS.Unordered; // set active state
  return prepareButtonStory(LIST_OPTIONS.Unordered);
}

ActiveUnorderedListButton.parameters = window.storybook.disableRtlMode;

export function InactiveUnorderedListHover() {
  return prepareButtonStory(LIST_OPTIONS.Unordered);
}

InactiveUnorderedListHover.parameters = {
  pseudo: { hover: true },
  ...window.storybook.disableRtlMode,
};