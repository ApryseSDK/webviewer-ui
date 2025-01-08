import React from 'react';
import IndexPanelContent from './IndexPanelContent';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const noop = () => { };

export default {
  title: 'Components/IndexPanelContent',
  component: IndexPanelContent,
  includeStories: ['Basic', 'Selecting', 'MultiSelecting'],
};

const DEFAULT_INDEX_PANEL_WIDTH = 293;

export const initialState = {
  viewer: {
    activeDocumentViewerKey: 1,
    customElementOverrides: {},
    disabledElements: {
      logoBar: { disabled: true },
    },
    openElements: {
      indexPanel: true,
      panel: true,
    },
    panelWidths: { indexPanel: DEFAULT_INDEX_PANEL_WIDTH },
    flyoutMap: {},
  },
  officeEditor: {},
};

export const basicProps = {
  isMultiSelectionMode: false,
  setSelected: noop,
  isActive: false,
  widgetId: '1',
  fieldName: 'Signature Field 1',
  icon: 'icon-tool-signature',
  handleDeletion: noop,
};

export const selectProps = {
  isMultiSelectionMode: false,
  setSelected: noop,
  isActive: true,
  widgetId: '1',
  fieldName: 'Signature Field 1',
  icon: 'icon-tool-signature',
};

export const multiSelectProps = {
  isMultiSelectionMode: true,
  setSelected: noop,
  isActive: true,
  widgetId: '1',
  fieldName: 'Signature Field 1',
  icon: 'icon-tool-signature',
};

export const renderComponent = (props = {}) => {
  const store = configureStore({ reducer: () => initialState });
  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <div id="outline-edit-popup-portal"></div>
        <Provider store={store}>
          <IndexPanelContent {...basicProps} {...props} />
        </Provider>
      </div>
    </div>
  );
};

export const Basic = () => {
  return renderComponent();
};

export const Selecting = () => {
  return renderComponent(selectProps);
};

export const MultiSelecting = () => {
  return renderComponent(multiSelectProps);
};