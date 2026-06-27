describe('FormFieldPanel utils', () => {
  const createCore = (tool) => ({
    getToolMode: () => tool,
  });

  const fields = {
    DEFAULT_VALUE: { type: 'text', label: 'formField.formFieldPopup.fieldValue' },
    DATE_FORMAT: { type: 'dateFormat', label: 'option.customStampModal.dateFormat' },
    NAME: { type: 'text', label: 'formField.formFieldPopup.fieldName' },
    RADIO_GROUP: { type: 'select', label: 'formField.formFieldPopup.fieldName' },
    SIGNATURE_OPTION: { type: 'signatureOption', label: 'formField.formFieldPopup.signatureOption' },
  };

  const loadHandleFieldCreation = () => {
    let handleFieldCreation;

    jest.isolateModules(() => {
      class FormFieldCreateTool {}
      class DatePickerFormFieldCreateTool extends FormFieldCreateTool {}
      class TextFormFieldCreateTool extends FormFieldCreateTool {}
      class TextWidgetAnnotation {}
      class DatePickerWidgetAnnotation extends TextWidgetAnnotation {}
      class SignatureWidgetAnnotation {}
      class RadioButtonWidgetAnnotation {}

      window.Core = {
        Annotations: {
          TextWidgetAnnotation,
          DatePickerWidgetAnnotation,
          SignatureWidgetAnnotation,
          RadioButtonWidgetAnnotation,
        },
        Tools: {
          FormFieldCreateTool,
          DatePickerFormFieldCreateTool,
          TextFormFieldCreateTool,
          SignatureFormFieldCreateTool: class SignatureFormFieldCreateTool extends FormFieldCreateTool {},
          ComboBoxFormFieldCreateTool: class ComboBoxFormFieldCreateTool extends FormFieldCreateTool {},
          ListBoxFormFieldCreateTool: class ListBoxFormFieldCreateTool extends FormFieldCreateTool {},
        },
      };

      ({ handleFieldCreation } = require('./utils'));
    });

    return handleFieldCreation;
  };

  it('does not show default value input for date picker tool with no selected annotation', () => {
    const handleFieldCreation = loadHandleFieldCreation();
    const datePickerTool = new window.Core.Tools.DatePickerFormFieldCreateTool();

    const panelFields = handleFieldCreation(null, fields, false, createCore(datePickerTool));

    expect(panelFields).toContain(fields.DATE_FORMAT);
    expect(panelFields).not.toContain(fields.DEFAULT_VALUE);
  });

  it('does not show default value input for selected date picker widget', () => {
    const handleFieldCreation = loadHandleFieldCreation();
    const datePickerTool = new window.Core.Tools.DatePickerFormFieldCreateTool();
    const datePickerWidget = new window.Core.Annotations.DatePickerWidgetAnnotation();

    const panelFields = handleFieldCreation(datePickerWidget, fields, false, createCore(datePickerTool));

    expect(panelFields).toContain(fields.DATE_FORMAT);
    expect(panelFields).not.toContain(fields.DEFAULT_VALUE);
  });

  it('still shows default value input for text form field tool', () => {
    const handleFieldCreation = loadHandleFieldCreation();
    const textTool = new window.Core.Tools.TextFormFieldCreateTool();

    const panelFields = handleFieldCreation(null, fields, false, createCore(textTool));

    expect(panelFields).toContain(fields.DEFAULT_VALUE);
    expect(panelFields).not.toContain(fields.DATE_FORMAT);
  });
});
