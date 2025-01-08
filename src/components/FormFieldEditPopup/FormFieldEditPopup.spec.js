import React from 'react';
import { render, fireEvent, getByText, getByDisplayValue, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormFieldEditPopup from './FormFieldEditPopup';
import { Basic } from './FormFieldEditPopup.stories';

const BasicFormFieldEditPopupStory = withI18n(Basic);

const TestFormFieldEditPopup = withProviders(FormFieldEditPopup);

function noop() { }

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

  return {
    X: 0,
    Y: 0,
    setWidth: (newWidth) => {
      width = parseInt(newWidth);
    },
    setHeight: (newHeight) => {
      height = parseInt(newHeight);
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


describe('FormFieldEditPopup', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicFormFieldEditPopupStory />);
      }).not.toThrow();
    });

    it('Renders an input for each of the Fields passed in', () => {
      const { container } = render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={indicator}
        />,
      );
      expect(container.querySelectorAll('.text-input')).toHaveLength(inputFields.length);
    });

    it('When a select input is passed as a field, it renders correctly as a radio button group select', () => {
      const { container } = render(
        <TestFormFieldEditPopup
          fields={selectField}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          radioButtonGroups={[]}
          indicator={indicator}
        />,
      );
      expect(container.querySelectorAll('.radio-group-label')).toHaveLength(selectField.length);
    });

    it('Renders an check input for each of the Field Flags passed in', () => {
      const { container } = render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={indicator}
        />,
      );
      // add extra input for show indicator checkbox
      expect(container.querySelectorAll('.ui__choice__input')).toHaveLength(sampleFlags.length + 1);
    });

    it('Should call handler to close popup when OK button is clicked', () => {
      const closeFormFieldEditPopup = jest.fn();
      const { container } = render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={closeFormFieldEditPopup}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={indicator}
        />,
      );
      const OKButton = container.querySelector('.ok-form-field-button');
      expect(OKButton).toBeInTheDocument();
      fireEvent.click(OKButton);
      expect(closeFormFieldEditPopup).toBeCalled();
    });

    it('Should render text input with Warning if field is not valid', () => {
      const { container } = render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen
          isValid={false} // NOT VALID!!
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={indicator}
        />,
      );

      expect(container.querySelector('.text-input-error')).toBeInTheDocument();
      const p = document.querySelector('.no-margin');
      expect(p.getAttribute('aria-live')).toEqual('assertive');
    });

    it('Should render select with warning message if passed', () => {
      const { container } = render(
        <TestFormFieldEditPopup
          fields={selectField}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={indicator}
          validationMessage={'Field Name already exists'}
          radioButtonGroups={[]}
        />,
      );
      getByText(container, 'Field Name already exists');
      expect(container.querySelector('.messageText')).toBeInTheDocument();
    });

    describe('Width and Height inputs', () => {
      const getPageHeight = () => (400);
      const getPageWidth = () => (200);
      it('accepts a width that is less than the page width', () => {
        const { container } = render(
          <TestFormFieldEditPopup
            fields={inputFields}
            flags={sampleFlags}
            closeFormFieldEditPopup={noop}
            isOpen
            isValid
            annotation={createMockAnnotation()}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
            indicator={indicator}
          />,
        );
        const widthInput = container.querySelector('#form-field-width');
        userEvent.clear(widthInput);
        userEvent.type(widthInput, '66');
        expect(widthInput).toHaveValue(66);
      });

      it('if entered width greater than page width, the width is set to page width', () => {
        const { container } = render(
          <TestFormFieldEditPopup
            fields={inputFields}
            flags={sampleFlags}
            closeFormFieldEditPopup={noop}
            isOpen
            isValid
            annotation={createMockAnnotation()}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
            indicator={indicator}
          />,
        );
        const widthInput = container.querySelector('#form-field-width');
        userEvent.clear(widthInput);
        userEvent.type(widthInput, '666');
        const pageWidth = getPageWidth();
        expect(widthInput).toHaveValue(pageWidth);
      });

      it('accepts a height that is less than the page height', () => {
        const { container } = render(
          <TestFormFieldEditPopup
            fields={inputFields}
            flags={sampleFlags}
            closeFormFieldEditPopup={noop}
            isOpen
            isValid
            annotation={createMockAnnotation()}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
            indicator={indicator}
          />,
        );
        const heightInput = container.querySelector('#form-field-height');
        userEvent.clear(heightInput);
        userEvent.type(heightInput, '200');
        expect(heightInput).toHaveValue(200);
      });

      it('if entered height greater than page height, the height is set to page height', () => {
        const { container } = render(
          <TestFormFieldEditPopup
            fields={inputFields}
            flags={sampleFlags}
            closeFormFieldEditPopup={noop}
            isOpen
            isValid
            annotation={createMockAnnotation()}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
            indicator={indicator}
          />,
        );
        const heightInput = container.querySelector('#form-field-height');
        userEvent.clear(heightInput);
        userEvent.type(heightInput, '888');
        const pageHeight = getPageHeight();
        expect(heightInput).toHaveValue(pageHeight);
      });
    });

    it('opens with correct indicator text', () => {
      const { container } = render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={indicator}
        />,
      );
      const indicatorText = getByDisplayValue(container, INDICATOR_TEXT);
      expect(indicatorText).toBeInTheDocument();
    });

    it('should have accessible form field and input elements', () => {
      const newIndicator = {
        ...indicator,
        isChecked: false,
      };
      const { container } = render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={newIndicator}
        />,
      );
      const input = container.querySelector('#indicator-input');
      expect(input.getAttribute('aria-disabled')).toEqual('true');

      const checkbox = container.querySelector('#field-indicator');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox.getAttribute('aria-checked')).toEqual('false');
    });

    it('should have accessible for flag group', () => {
      const newIndicator = {
        ...indicator,
        isChecked: false,
      };
      render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={newIndicator}
        />,
      );
      const titleElement = screen.getByRole('heading', { name: 'Field Flags' });
      expect(titleElement).toHaveClass('field-flags-title');
      expect(titleElement).toHaveAttribute('id', 'field-flags-group');
      expect(titleElement.tagName).toBe('H2');

      screen.getByRole('group', { name: 'Field Flags' });
    });
  });
});