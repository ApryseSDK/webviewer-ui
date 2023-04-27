import React from 'react';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import core from 'core';
import Panel from 'components/Panel';
import GenericOutlinesPanel from './GenericOutlinesPanel';
import { getDefaultOutlines } from '../Outline/Outline.stories';

export default {
  title: 'Components/GenericOutlinesPanel',
  component: GenericOutlinesPanel,
};

const DEFAULT_NOTES_PANEL_WIDTH = 330;

core.isFullPDFEnabled = () => true;

export const Editable = () => {
  const reducer = () => {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
        isOutlineEditingEnabled: true,
        pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        openElements: {
          'outlines-panel': true,
        },
        panelWidths: { 'outlines-panel': DEFAULT_NOTES_PANEL_WIDTH },
        isInDesktopOnlyMode: true,
      },
      document: {
        outlines: getDefaultOutlines(),
      },
    };
  };
  return (
    <>
      <Provider store={createStore(reducer)}>
        <Panel dataElement="outlines-panel">
          <GenericOutlinesPanel />
        </Panel>
      </Provider>
    </>
  );
};

export const NonEditable = () => {
  const reducer = () => {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
        isOutlineEditingEnabled: false,
        pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        openElements: {
          'outlines-panel': true,
        },
        panelWidths: { 'outlines-panel': DEFAULT_NOTES_PANEL_WIDTH },
        isInDesktopOnlyMode: true,
      },
      document: {
        outlines: getDefaultOutlines(),
      },
    };
  };

  return (
    <>
      <Provider store={createStore(reducer)}>
        <Panel dataElement="outlines-panel">
          <GenericOutlinesPanel />
        </Panel>
      </Provider>
    </>
  );
};

export const Expanded = () => {
  const reducer = () => {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
        isOutlineEditingEnabled: true,
        autoExpandOutlines: true,
        pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        openElements: {
          'outlines-panel': true,
        },
        panelWidths: { 'outlines-panel': DEFAULT_NOTES_PANEL_WIDTH },
        isInDesktopOnlyMode: true,
      },
      document: {
        outlines: getDefaultOutlines(),
      },
    };
  };

  return (
    <>
      <Provider store={createStore(reducer)}>
        <Panel dataElement="outlines-panel">
          <GenericOutlinesPanel />
        </Panel>
      </Provider>
    </>
  );
};

export const NoOutlines = () => {
  const reducer = () => {
    return {
      viewer: {
        disabledElements: {},
        customElementOverrides: {},
        isOutlineEditingEnabled: true,
        pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        openElements: {
          'outlines-panel': true,
        },
        panelWidths: { 'outlines-panel': DEFAULT_NOTES_PANEL_WIDTH },
        isInDesktopOnlyMode: true,
      },
      document: {
        outlines: [],
      },
    };
  };

  return (
    <>
      <Provider store={createStore(reducer)}>
        <Panel dataElement="outlines-panel">
          <GenericOutlinesPanel />
        </Panel>
      </Provider>
    </>
  );
};
