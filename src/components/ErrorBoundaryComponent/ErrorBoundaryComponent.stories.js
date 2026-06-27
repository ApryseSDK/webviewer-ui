import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { expect, within } from 'storybook/test';

import rootReducer from 'src/redux/reducers/rootReducer';
import ErrorBoundaryComponent from './ErrorBoundaryComponent';
import Panel from 'components/Panel';
import ModalWrapper from 'components/ModalWrapper';
import COMPONENT_TYPES from 'constants/componentTypes';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';
import { disableRtlModeParameters } from 'helpers/storybookParams';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
});

export default {
  title: 'Components/ErrorBoundaryComponent',
  component: ErrorBoundaryComponent,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const ThrowOnRender = () => {
  throw new Error('Storybook crash test');
};

export function CrashFallback() {
  return (
    <ErrorBoundaryComponent dataElement="storyPanel">
      <ThrowOnRender />
    </ErrorBoundaryComponent>
  );
}

export function CrashFallbackForPanel() {
  const panelState = {
    viewer: {
      customElementOverrides: {},
      disabledElements: {
        logoBar: { disabled: true },
      },
      openElements: {
        storyPanel2: true,
      },
      panelWidths: { storyPanel2: 293 },
      sortStrategy: 'position',
      isInDesktopOnlyMode: true,
      modularHeaders: {},
    },
  };
  const panelStore = configureStore({ reducer: () => panelState });
  return (
    <Provider store={panelStore}>
      <Panel dataElement="storyPanel2" location="left">
        <ThrowOnRender />
      </Panel>
    </Provider>
  );
}

export function CrashFallbackForModal() {
  const modalState = {
    viewer: {
      customElementOverrides: {},
      disabledElements: {},
      openElements: {
        storyModal: true,
      },
      isInDesktopOnlyMode: true,
      modularHeaders: {},
    },
  };
  const modalStore = configureStore({ reducer: () => modalState });
  return (
    <Provider store={modalStore}>
      <ModalWrapper
        isOpen
        title="message.error"
        modalDataElement="storyModal"
        onCloseClick={() => {}}
      >
        <ThrowOnRender />
      </ModalWrapper>
    </Provider>
  );
}

CrashFallbackForModal.parameters = disableRtlModeParameters;

CrashFallbackForModal.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const componentType = getTranslatedText(`message.renderErrors.componentType.${COMPONENT_TYPES.MODAL}`);
  const expectedMessage = getTranslatedText('message.renderErrors.toFixIssue', { componentType });
  const message = await canvas.findByText(expectedMessage);
  expect(message).toBeInTheDocument();
};

