import React from 'react';
import Header from './Header';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { userEvent, expect, within } from '@storybook/test';
import { MockApp } from 'helpers/storybookHelper';

export default {
  title: 'Components/Header',
  component: Header,
  parameters: {
    customizableUI: true
  }
};

const mockedState = {
  ...initialState,
  featureFlags: {
    customizableUI: true,
  },
};

const store = configureStore({
  reducer: () => mockedState
});

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <Header {...props} />
    </Provider>
  );
};

export const DefaultHeader = BasicComponent.bind({});
DefaultHeader.args = {
  isToolsHeaderOpen: true,
  isMultiTab: true,
};

// Custom panels
const DEFAULT_NOTES_PANEL_WIDTH = 293;

export const CustomBasic = () => {
  const basicState = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      genericPanels: [
        {
          dataElement: 'panel1',
          render: 'bookmarksPanel',
        }
      ],
      openElements: {
        ...initialState.viewer.openElements,
        contextMenuPopup: false,
        panel1: true,
      },
      panelWidths: { panel: DEFAULT_NOTES_PANEL_WIDTH },
      sortStrategy: 'position',
      isInDesktopOnlyMode: true,
      disabledElements: {
        ...initialState.viewer.disabledElements,
        'bookmarksPanel': { disabled: false, priority: 3 },
        'bookmarksPanelButton': { disabled: false, priority: 3 },
      },
      currentPage: 3,
      activeGroupedItems: ['annotateGroupedItems'],
      activeCustomRibbon: 'toolbarGroup-Annotate',
      activeToolName: 'Select',
    },
    document: {
      ...initialState.document,
      bookmarks: {
        0: 'B1',
        1: 'B2',
      }
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <MockApp initialState={basicState} />;
};

CustomBasic.parameters = { layout: 'fullscreen', customizableUI: true };
CustomBasic.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const panButton = await canvas.findByRole('button', { name: 'Pan' });
  expect(panButton).toHaveAttribute('aria-current', 'false');

  await userEvent.click(panButton);
  await userEvent.click(panButton);
  expect(panButton).toHaveAttribute('aria-current', 'true');
};