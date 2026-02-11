import React from 'react';
import FormulaBar from './FormulaBar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'SpreadsheetEditor/FormulaBar',
  component: FormulaBar,
};

const activeCellRange = 'A1';
const cellFormula = '=SUM(A1:A10)';

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
      <FormulaBar {...props}/>
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