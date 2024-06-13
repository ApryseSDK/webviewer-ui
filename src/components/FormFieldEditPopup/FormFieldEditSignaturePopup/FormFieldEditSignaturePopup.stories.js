import React from 'react';
import FormFieldEditSignaturePopup from './FormFieldEditSignaturePopup';
import { configureStore } from '@reduxjs/toolkit';


import { Provider } from 'react-redux';


export default {
  title: 'Components/FormFieldEditPopup',
  component: FormFieldEditSignaturePopup,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};

const store = configureStore({ reducer: () => initialState });

const annotation = {
  Width: 100,
  Height: 100,
};

export function SignatureFieldPopup() {
  const signatureFields = [
    {
      label: 'formField.formFieldPopup.fieldName',
      onChange: () => { },
      value: 'SignatureField1',
      required: true,
      type: 'text',
    },
  ];

  const signatureFlags = [
    {
      label: 'formField.formFieldPopup.readOnly',
      onChange: () => { },
      isChecked: true,
    },
    {
      label: 'formField.formFieldPopup.required',
      onChange: () => { },
      isChecked: true,
    }
  ];

  const indicator = {
    label: 'formField.formFieldPopup.documentFieldIndicator',
    toggleIndicator: () => { },
    isChecked: true,
    onChange: () => { },
    value: 'This is an indicator'
  };

  const props = {
    fields: signatureFields,
    flags: signatureFlags,
    annotation,
    isValid: true,
    getSignatureOptionHandler: () => 'initialsSignature',
    indicator,
  };
  return (
    <Provider store={store}>
      <div className="FormFieldEditPopupContainer">
        <FormFieldEditSignaturePopup {...props} />
      </div>
    </Provider>
  );
}
