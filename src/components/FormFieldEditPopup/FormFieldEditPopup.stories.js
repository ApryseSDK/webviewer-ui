import React from 'react';
import FormFieldEditPopup from './FormFieldEditPopup'
import { createStore } from 'redux';

import { Provider } from "react-redux";


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
function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

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
}


export function Basic() {
  const props = {
    fields,
    flags,
    annotation,
  };
  return (
    <Provider store={store}>
      <div className='FormFieldEditPopupContainer'>
        <FormFieldEditPopup {...props} />
      </div>
    </Provider>
  );
}


