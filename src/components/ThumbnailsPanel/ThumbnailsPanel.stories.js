import React from 'react';
import { Provider } from 'react-redux';
import Panel from 'components/Panel';
import ThumbnailsPanel from './ThumbnailsPanel';
import initialState from 'src/redux/initialState';
import { createStore } from 'src/helpers/storybookHelper';
import { userEvent, within, expect } from 'storybook/test';
import rootReducer from 'reducers/rootReducer';
import { configureStore } from '@reduxjs/toolkit';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'Components/Thumbnails',
  component: ThumbnailsPanel,
};

const myState = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    openElements: {
      ...initialState.viewer.openElements,
      thumbnailsPanel: true,
      leftPanel: true,
    },
    panelWidths: {
      ...initialState.viewer.panelWidths,
      leftPanel: 264,
      thumbnailsPanel: 300,
    },
    pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    multiPageManipulationControls: [
      { dataElement: 'leftPanelPageTabsRotate' },
      { type: 'divider' },
      { dataElement: 'leftPanelPageTabsMove' },
      { type: 'divider' },
      { dataElement: 'leftPanelPageTabsMore' },
    ]
  },
  document: {
    ...initialState.document,
    totalPages: {
      1: 10,
    },
  },
  featureFlags: {
    customizableUI: true,
  },
};

export const Thumbnails = () => {
  return (
    <Provider store={createStore(myState)}>
      <Panel dataElement="thumbnailsPanel">
        <ThumbnailsPanel />
      </Panel>
    </Provider>
  );
};

Thumbnails.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  const thumbnailContainer = canvas.getByLabelText(getTranslatedText('component.thumbnailsPanel'));
  await expect(thumbnailContainer).toBeInTheDocument();

  const thumbnails = canvas.getAllByRole('gridcell');

  thumbnails[0].focus();
  await userEvent.keyboard('{Enter}');

  const thumbnail = within(thumbnails[0]).getAllByRole('button')[0];
  const thumbnailControls = within(thumbnail).getAllByRole('button');
  expect(thumbnailControls).toHaveLength(3);

  expect(thumbnailControls[0]).toHaveFocus();
  expect(thumbnailControls[0]).toHaveAttribute('aria-current', 'page');

  await userEvent.keyboard('{ArrowRight}');
  expect(thumbnailControls[1]).toHaveFocus();
  expect(thumbnailControls[1]).toHaveAttribute('aria-current', 'page');

  await userEvent.keyboard('{ArrowRight}');
  expect(thumbnailControls[2]).toHaveFocus();
  expect(thumbnailControls[2]).toHaveAttribute('aria-current', 'page');

  await userEvent.tab();
  expect(thumbnails[1]).toHaveFocus();
  expect(thumbnails[1]).toHaveAttribute('aria-current', 'page');
};

export const ThumbnailsMultiSelect = () => {
  const state = {
    ...myState,
    viewer: {
      ...myState.viewer,
      thumbnailSelectingPages: true,
    }
  };

  return (
    <Provider store={createStore(state)}>
      <Panel dataElement="thumbnailsPanel">
        <ThumbnailsPanel/>
      </Panel>
    </Provider>
  );
};


const clickedStates = { button1: false, button2: false };
const state = {
  ...myState,
  viewer: {
    ...myState.viewer,
    thumbnailSelectingPages: true,
    multiPageManipulationControls: [
      {
        type: 'customPageOperation',
        header: 'Custom options2',
        dataElement: 'customPageOperations2',
        operations: [
          {
            title: 'Alert me 2',
            img: 'icon-save',
            onClick: (selectedPageNumbers) => {
              clickedStates.button1 = selectedPageNumbers;
              console.log(selectedPageNumbers);
            },
            dataElement: 'customPageOperationButton2',
          }
        ]
      },
      { type: 'divider' },
      { dataElement: 'leftPanelPageTabsRotate' },
      { type: 'divider' },
      { dataElement: 'leftPanelPageTabsMove' },
      { type: 'divider' },
      { dataElement: 'leftPanelPageTabsMore' },
      { type: 'divider' },
      {
        type: 'customPageOperation',
        header: 'Custom options',
        dataElement: 'customPageOperations',
        operations: [
          {
            title: 'Alert me',
            img: 'icon-save',
            onClick: (selectedPageNumbers) => {
              clickedStates.button2 = selectedPageNumbers;
            },
            dataElement: 'customPageOperationButton',
          }
        ]
      },
    ],
    panelWidths: {
      ...myState.panelWidths,
      thumbnailsPanel: 500,
    },
    selectedThumbnailPageIndexes: [1, 2, 4],
  },
};
const store = configureStore({ reducer: rootReducer, preloadedState: state });
export const ThumbnailsMultiSelectCustomItems = () => {
  return (
    <Provider store={store}>
      <Panel dataElement="thumbnailsPanel">
        <ThumbnailsPanel panelSelector="thumbnailsPanel"/>
      </Panel>
    </Provider>
  );
};

ThumbnailsMultiSelectCustomItems.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button1 = canvas.getByLabelText('Alert me 2');
  button1.click();
  await expect(Array.isArray(clickedStates.button1)).toEqual(true);
  const flyoutItems = store.getState().viewer.flyoutMap.pageManipulationFlyoutMultiSelect.items;
  await expect(flyoutItems.length).toEqual(8);
  const lastItem = flyoutItems[flyoutItems.length - 1];
  lastItem.onClick();
  await expect(Array.isArray(clickedStates.button2)).toEqual(true);
};