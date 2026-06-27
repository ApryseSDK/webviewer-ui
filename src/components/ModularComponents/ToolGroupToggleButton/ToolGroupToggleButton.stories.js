import React from 'react';
import ToolGroupToggleButton from './ToolGroupToggleButton';
import ModularHeader from '../ModularHeader/ModularHeader';
import { expect, within } from 'storybook/test';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import rootReducer from 'reducers/rootReducer';
import { mockModularComponents } from '../AppStories/mockAppState';
import actions from 'src/redux/actions';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'ModularComponents/ToolGroupToggleButton',
  component: ToolGroupToggleButton,
};

let store = null;

const Basic = (activeToolName) => {
  const divider = {
    dataElement: 'customDivider',
    type: 'divider',
  };
  const rectangleToolButton = {
    dataElement: 'rectangleToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateRectangle',
  };
  const ellipseToolButton = {
    dataElement: 'ellipseToolButton',
    type: 'toolButton',
    toolName: 'AnnotationCreateEllipse',
  };
  const shapesToolGroup = {
    dataElement: 'shapesToolGroup',
    type: 'groupedItems',
    items: [divider, rectangleToolButton, ellipseToolButton],
    grow: 0,
    gap: 12,
    alwaysVisible: false,
    style: {},
  };
  const shapesToolGroupForStore = {
    ...shapesToolGroup,
    items: ['rectangleToolButton', 'ellipseToolButton'],
  };
  const shapesToggleButton = {
    dataElement: 'shapesToggleButton',
    type: 'toolGroupToggleButton',
    groupedItems: 'shapesToolGroup',
    title: 'Shape Tools',
  };

  const mockInitialState = {
    viewer: {
      ...initialState.viewer,
      modularComponents: {
        ...mockModularComponents,
        shapesToggleButton,
        shapesToolGroup: shapesToolGroupForStore,
        rectangleToolButton,
        ellipseToolButton,
      },
      activeToolName,
    },
    featureFlags: {
      ...initialState.featureFlags,
      customizableUI: true,
    },
  };
  const headerProps = {
    dataElement: 'toolGroupToggleHeader',
    placement: 'top',
    gap: 20,
    items: [shapesToggleButton, shapesToolGroup],
  };
  store = configureStore({
    reducer: rootReducer,
    preloadedState: mockInitialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false, })
  });

  return (
    <Provider store={store}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <ModularHeader {...headerProps} />
      </div>
    </Provider>
  );
};

export const ActiveToolGroupToggle = () => Basic('AnnotationCreateRectangle');

ActiveToolGroupToggle.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  let toggleButton = await canvas.findByRole('button', { name: 'Shape Tools' });
  let rectangleToolButton = await canvas.findByRole('button', { name: getTranslatedText('annotation.rectangle') });
  let ellipseToolButton = await canvas.findByRole('button', { name: getTranslatedText('annotation.ellipse') });

  expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
  expect(rectangleToolButton).toHaveAttribute('aria-pressed', 'true');
  expect(ellipseToolButton).toHaveAttribute('aria-pressed', 'false');

  store.dispatch(actions.setActiveToolNameAndStyle({ name: 'AnnotationCreateEllipse' }));
  toggleButton = await canvas.findByRole('button', { name: 'Shape Tools' });
  rectangleToolButton = await canvas.findByRole('button', { name: getTranslatedText('annotation.rectangle') });
  ellipseToolButton = await canvas.findByRole('button', { name: getTranslatedText('annotation.ellipse') });

  expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
  expect(rectangleToolButton).toHaveAttribute('aria-pressed', 'false');
  expect(ellipseToolButton).toHaveAttribute('aria-pressed', 'true');
};

ActiveToolGroupToggle.parameters = {
  chromatic: {
    modes: {
      'Dark theme': { disable: true },
    },
  },
};

export const InactiveToolGroupToggle = () => Basic('AnnotationEdit');

InactiveToolGroupToggle.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const toggleButton = await canvas.findByRole('button', { name: 'Shape Tools' });
  expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
};

InactiveToolGroupToggle.parameters = {
  chromatic: {
    modes: {
      'Light theme RTL': { disable: true },
      'Dark theme': { disable: true },
    },
  },
};
