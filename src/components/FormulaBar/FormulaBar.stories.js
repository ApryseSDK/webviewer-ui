import React from 'react';
import FormulaBar from './FormulaBar';
import core from 'core';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { expect, userEvent, within } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'SpreadsheetEditor/FormulaBar',
  component: FormulaBar,
  tags: ['vitest'],
  beforeEach: () => {
    const manager = core.getDocumentViewer().getSpreadsheetEditorManager();
    manager.enableClipboard();
    return () => manager.enableClipboard();
  },
};

const activeCellRange = 'A1';
const cellFormula = '=SUM(A1:A10)';
const multilineCellValue = [
  'Ensure a continuous strip of insulation is in contact with the walls.',
  'Verify that insulation materials are properly installed without gaps.',
  'Confirm that cavity closers are present at door thresholds.',
  'Check sealing to maintain airtightness and thermal continuity.',
  'Inspect the completed installation before closing the wall.',
].join('\n');

const initialState = {
  viewer: {}
};
function rootReducer(state = initialState) {
  return state;
}

const store = configureStore({ reducer: rootReducer });

const Basic = (props) => {
  return (
    <Provider store={store}>
      <FormulaBar
        onRangeInputChange={() => {}}
        onRangeInputKeyDown={() => {}}
        {...props}
      />
    </Provider>
  );
};

export const FormulaBarDefault = () => {
  return (
    <Basic isReadOnly={false} activeCellRange={activeCellRange} cellFormula={cellFormula} />
  );
};

export const FormulaBarReadOnly = () => {
  return (
    <Basic isReadOnly={true} activeCellRange={activeCellRange} cellFormula={cellFormula}  />
  );
};

export const FormulaBarMultiline = () => (
  <Basic
    isReadOnly={false}
    activeCellRange={activeCellRange}
    cellFormula=""
    stringCellValue={multilineCellValue}
    multiline={true}
  />
);

FormulaBarMultiline.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const formulaBarLabel = getTranslatedText('formulaBar.label');
  const formulaInput = canvas.getByRole('textbox', { name: formulaBarLabel });
  const expandButton = canvas.getByRole('button', { name: `${getTranslatedText('action.expand')} ${formulaBarLabel}` });

  expect(formulaInput).toHaveValue(multilineCellValue);
  expect(expandButton).toHaveAttribute('aria-expanded', 'false');
  expect(formulaInput.scrollHeight).toBeGreaterThan(formulaInput.clientHeight);
};

export const FormulaBarMultilineExpanded = () => (
  <Basic
    isReadOnly={false}
    activeCellRange={activeCellRange}
    cellFormula=""
    stringCellValue={multilineCellValue}
    multiline={true}
  />
);

FormulaBarMultilineExpanded.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const formulaBarLabel = getTranslatedText('formulaBar.label');
  const expandButton = canvas.getByRole('button', { name: `${getTranslatedText('action.expand')} ${formulaBarLabel}` });
  await userEvent.click(expandButton);

  const formulaInput = canvas.getByRole('textbox', { name: formulaBarLabel });
  expect(canvas.getByRole('button', { name: `${getTranslatedText('action.collapse')} ${formulaBarLabel}` })).toHaveAttribute('aria-expanded', 'true');
  expect(formulaInput).toHaveValue(multilineCellValue);
};