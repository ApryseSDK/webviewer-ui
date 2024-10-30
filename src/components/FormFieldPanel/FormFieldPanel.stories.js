import React from 'react';
import FormFieldPanel from './FormFieldPanel';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';


export default {
  title: 'Components/FormFieldEditPanel',
  component: FormFieldPanel,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
  }
};

const store = configureStore({ reducer: () => initialState });

const indicator = {
  label: 'formField.formFieldPopup.documentFieldIndicator',
  toggleIndicator: () => { },
  isChecked: true,
  onChange: () => { },
  value: 'This is an indicator'
};

const annotation = {
  Width: 100,
  Height: 100,
  getCustomData: () => { },
  getField: () => {
    return {
      getFieldType: () => 'TextFormField',
    };
  }
};

const noop = () => { };

const Fields = {
  NAME: {
    label: 'formField.formFieldPopup.fieldName',
    onChange: noop,
    value: 'fieldName',
    required: true,
    type: 'text',
  },
  VALUE: {
    label: 'formField.formFieldPopup.fieldValue',
    onChange: noop,
    value: 'fieldValue',
    type: 'text',
  },
};

const fields = [
  Fields.NAME,
  Fields.VALUE
];

const Flags = {
  READ_ONLY: {
    label: 'formField.formFieldPopup.readOnly',
    onChange: noop,
    isChecked: true,
  },
  MULTI_LINE: {
    label: 'formField.formFieldPopup.multiLine',
    onChange: noop,
    isChecked: true,
  },
  REQUIRED: {
    label: 'formField.formFieldPopup.required',
    onChange: noop,
    isChecked: true,
  },
  MULTI_SELECT: {
    label: 'formField.formFieldPopup.multiSelect',
    onChange: noop,
    isChecked: true,
  },
};

const flags = [
  Flags.READ_ONLY,
  Flags.MULTI_LINE,
  Flags.REQUIRED,
];



export function Basic() {
  const props = {
    fields,
    flags,
    annotation,
    indicator,
    closeFormFieldEditPanel: noop
  };
  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={store}>
          <div className="FormFieldPanel">
            <FormFieldPanel {...props} />
          </div>
        </Provider>
      </div>
    </div>
  );
}
