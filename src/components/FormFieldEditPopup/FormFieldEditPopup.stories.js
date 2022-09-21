import React from 'react';
import FormFieldEditPopup from './FormFieldEditPopup';
import { configureStore } from '@reduxjs/toolkit';

import { Provider } from 'react-redux';


export default {
  title: 'Components/FormFieldEditPopup',
  component: FormFieldEditPopup,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};

const store = configureStore({ reducer: () => initialState });

const fields = [
  {
    label: 'formField.formFieldPopup.fieldName',
    onChange: () => { },
    value: 'Name',
    required: true,
    type: 'text',
  },
  {
    label: 'formField.formFieldPopup.fieldValue',
    onChange: () => { },
    value: 'Miguelito',
    type: 'text',
  }
];

const flags = [
  {
    label: 'formField.formFieldPopup.readOnly',
    onChange: () => { },
    isChecked: true,
  },
  {
    label: 'formField.formFieldPopup.multiLine',
    onChange: () => { },
    isChecked: false,
  },
  {
    label: 'formField.formFieldPopup.required',
    onChange: () => { },
    isChecked: true,
  }
];

const annotation = {
  Width: 100,
  Height: 100,
  getCustomData: () => { },
  getFormFieldPlaceHolderType: () => { },
};

const indicator = {
  label: 'formField.formFieldPopup.documentFieldIndicator',
  toggleIndicator: () => { },
  isChecked: true,
  onChange: () => { },
  value: 'This is an indicator'
};


export function Basic() {
  const props = {
    fields,
    flags,
    annotation,
    indicator
  };
  return (
    <Provider store={store}>
      <div className="FormFieldEditPopupContainer">
        <FormFieldEditPopup {...props} />
      </div>
    </Provider>
  );
}
