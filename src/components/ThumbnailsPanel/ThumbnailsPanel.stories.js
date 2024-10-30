import React from 'react';
import { Provider } from 'react-redux';
import Panel from 'components/Panel';
import ThumbnailsPanel from './ThumbnailsPanel';
import initialState from 'src/redux/initialState';
import { createStore } from 'src/helpers/storybookHelper';
import { userEvent, within, expect } from '@storybook/test';

export default {
  title: 'Components/Thumbnails',
  component: ThumbnailsPanel,
  parameters: {
    customizableUI: true,
  },
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

  const thumbnailContainer = canvas.getByLabelText('Thumbnails');
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