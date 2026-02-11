import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { within, expect } from 'storybook/test';
import rootReducer from 'reducers/rootReducer';
import core from 'core';
import OfficeEditorColumnsModal from './OfficeEditorColumnsModal';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

const officeEditorStub = (() => {
  const baseColumns = [120, 36, 120];
  return {
    async getSectionColumns() {
      return baseColumns;
    },
    async getMaxColumns() {
      return 4;
    },
    async getEditingPageNumber() {
      return 1;
    },
    async buildEqualColumnsConfig() {
      return baseColumns;
    },
    async buildEqualColumnsConfigFromWidth() {
      return baseColumns;
    },
    async clampColumnWidthToSectionLimits(value) {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 120;
    },
    async clampColumnSpacingToSectionLimits(value) {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 36;
    },
    async setCustomSectionColumns() {
      return;
    },
  };
})();

core.getOfficeEditor = () => officeEditorStub;

const store = configureStore({ reducer: rootReducer });

const Template = () => (
  <Provider store={store}>
    <OfficeEditorColumnsModal />
  </Provider>
);

export default {
  title: 'OfficeEditor/ColumnsModal',
  component: OfficeEditorColumnsModal,
  render: Template,
};

export const Default = Template.bind({});

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const columnAmountLabel = getTranslatedText('officeEditor.columnsModal.columnAmount');
  const columnInput = await canvas.findByLabelText(columnAmountLabel);
  expect(columnInput.value).toBe('2');

  const firstColumnWidthLabel = `${getTranslatedText('officeEditor.column')} 1 ${getTranslatedText('officeEditor.columnsModal.width')}`;
  const firstColumnWidth = await canvas.findByLabelText(firstColumnWidthLabel);
  expect(firstColumnWidth.value).toBe('4.23');
};
