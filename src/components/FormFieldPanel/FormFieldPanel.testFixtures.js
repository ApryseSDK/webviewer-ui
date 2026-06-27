const noop = () => {};

export const inputFields = [
  {
    label: 'formField.formFieldPopup.fieldName',
    onChange: noop,
    value: 'fieldName',
    required: true,
    type: 'text',
    message: 'formField.formFieldPopup.nameRequired',
  },
  {
    label: 'formField.formFieldPopup.fieldValue',
    onChange: noop,
    value: 'fieldValue',
    type: 'text',
  },
];

export const selectField = [
  {
    label: 'formField.formFieldPopup.fieldName',
    onChange: noop,
    value: 'fieldName',
    required: true,
    type: 'select',
    message: 'formField.formFieldPopup.nameRequired',
  },
];

export const sampleFlags = [
  {
    label: 'formField.formFieldPopup.readOnly',
    onChange: noop,
    isChecked: true,
  },
  {
    label: 'formField.formFieldPopup.multiLine',
    onChange: noop,
    isChecked: false,
  },
];

export const INDICATOR_TEXT = 'This is an indicator';

export const indicator = {
  label: 'formField.formFieldPopup.documentFieldIndicator',
  toggleIndicator: noop,
  isChecked: true,
  onChange: noop,
  value: INDICATOR_TEXT,
};

export const createMockAnnotation = () => {
  let width = 100;
  let height = 100;
  const parseDimension = (value) => value === '' ? 0 : Number.parseInt(value, 10);

  return {
    X: 0,
    Y: 0,
    setWidth: (newWidth) => {
      width = parseDimension(newWidth);
    },
    setHeight: (newHeight) => {
      height = parseDimension(newHeight);
    },
    get Width() {
      return width;
    },
    get Height() {
      return height;
    },
    getCustomData: () => {
      return {
        'trn-form-field-show-indicator': 'true',
        'trn-form-field-indicator-text': 'Sign Here',
      };
    },
    getField: () => {
      return {
        getFieldType: () => 'TextFormField',
      };
    },
  };
};
