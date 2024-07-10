import React from 'react';
import FileAttachmentPanelComponent from './FileAttachmentPanel';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Panel from 'components/Panel';

export default {
  title: 'ModularComponents/FileAttachmentPanel',
  component: FileAttachmentPanelComponent,
  parameters: {
    customizableUI: true,
  }
};

const initialState = {
  viewer: {
    openElements: {
      panel: true,
    },
    disabledElements: {},
    customElementOverrides: {},
    tab: {},
    panelWidths: { panel: 300 },
    modularHeaders: {},
  }
};

export function FileAttachmentPanelLeftEmpty() {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <Panel location={'left'} dataElement={'panel'}>
        <FileAttachmentPanelComponent />
      </Panel>
    </Provider>
  );
}

export function FileAttachmentPanelRightEmpty() {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <Panel location={'right'} dataElement={'panel'}>
        <FileAttachmentPanelComponent />
      </Panel>
    </Provider>
  );
}

const filesMock = {
  embeddedFiles: [
    { filename: '1.png' },
    { filename: '15pages.pdf' },
  ],
  fileAttachmentAnnotations: [],
};
filesMock.fileAttachmentAnnotations[1] = [{ PageNumber: 1, filename: '2.png' }];
filesMock.fileAttachmentAnnotations[5] = [{ PageNumber: 5, filename: 'signature.png' }];
filesMock.fileAttachmentAnnotations[8] = [{ PageNumber: 8, filename: 'q.jpeg' }];

export function FileAttachmentPanelLeftWithFiles() {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <Panel location={'left'} dataElement={'panel'}>
        <FileAttachmentPanelComponent initialFiles={filesMock} />
      </Panel>
    </Provider>
  );
}

export function FileAttachmentPanelRightWithFiles() {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <Panel location={'right'} dataElement={'panel'}>
        <FileAttachmentPanelComponent initialFiles={filesMock} />
      </Panel>
    </Provider>
  );
}
