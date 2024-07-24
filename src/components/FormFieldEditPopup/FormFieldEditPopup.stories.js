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
    confirmChange: () => { },
    value: 'Name',
    setValue: () => {},
    required: true,
    type: 'text',
  },
  {
    label: 'formField.formFieldPopup.fieldValue',
    confirmChange: () => { },
    value: 'Miguelito',
    setValue: () => {},
    type: 'text',
  }
];

const flags = [
  {
    label: 'formField.formFieldPopup.readOnly',
    confirmChange: () => { },
    isChecked: true,
    setIsChecked: () => {},
  },
  {
    label: 'formField.formFieldPopup.multiLine',
    confirmChange: () => { },
    isChecked: false,
    setIsChecked: () => {},
  },
  {
    label: 'formField.formFieldPopup.required',
    confirmChange: () => { },
    isChecked: true,
    setIsChecked: () => {},
  }
];

const annotation = {
  Width: 100,
  Height: 100,
  getCustomData: () => { },
  getFormFieldPlaceholderType: () => { },
};

const indicator = {
  label: 'formField.formFieldPopup.documentFieldIndicator',
  confirmToggleIndicator: () => { },
  isChecked: true,
  confirmTextChange: () => { },
  textValue: 'This is an indicator'
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
