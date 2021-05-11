import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormFieldEditPopup from './FormFieldEditPopup';
import { Basic } from './FormFieldEditPopup.stories';

const BasicFormFieldEditPopupStory = withI18n(Basic);

const TestFormFieldEditPopup = withProviders(FormFieldEditPopup);

function noop() { }

const inputFields = [
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
    type: 'text'
  }
];

const selectField = [
  {
    label: 'formField.formFieldPopup.fieldName',
    onChange: noop,
    value: 'fieldName',
    required: true,
    type: 'select',
    message: 'formField.formFieldPopup.nameRequired',
  },
];

const sampleFlags = [
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

const createMockAnnotation = () => {
  let width = 100;
  let height = 100;

  return {
    X: 0,
    Y: 0,
    setWidth: (newWidth) => width = parseInt(newWidth),
    setHeight: (newHeight) => height = parseInt(newHeight),
    get Width() {
      return width;
    },
    get Height() {
      return height;
    }
  }
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
          isOpen={true}
          isValid={true}
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
        />
      );
      expect(container.querySelectorAll('.ui__input__input')).toHaveLength(inputFields.length);
    });

    it('When a select input is passed as a field, it renders correctly as a radio button group select', () => {
      const { container } = render(
        <TestFormFieldEditPopup
          fields={selectField}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen={true}
          isValid={true}
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          radioButtonGroups={[]}
        />
      );
      expect(container.querySelectorAll('.radio-group-label')).toHaveLength(selectField.length);
    });

    it('Renders an check input for each of the Field Flags passed in', () => {
      const { container } = render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen={true}
          isValid={true}
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
        />
      );
      expect(container.querySelectorAll('.ui__choice__input')).toHaveLength(sampleFlags.length);
    });

    it('Should call handler to close popup when OK button is clicked', () => {
      const closeFormFieldEditPopup = jest.fn();
      const { container } = render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={closeFormFieldEditPopup}
          isOpen={true}
          isValid={true}
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
        />
      );
      const OKButton = container.querySelector('.ok-form-field-button');
      expect(OKButton).toBeInTheDocument();
      fireEvent.click(OKButton);
      expect(closeFormFieldEditPopup).toBeCalled();
    });

    it('Should render with Warning if popup is not valid', () => {
      const { container } = render(
        <TestFormFieldEditPopup
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPopup={noop}
          isOpen={true}
          isValid={false} //NOT VALID!!
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
        />
      );

      expect(container.querySelector('.ui__input--message-warning')).toBeInTheDocument();
    })

    describe('Width and Height inputs', () => {

      const getPageHeight = () => (400);
      const getPageWidth = () => (200);
      it('accepts a width that is less than the page width', () => {
        const { container } = render(
          <TestFormFieldEditPopup
            fields={inputFields}
            flags={sampleFlags}
            closeFormFieldEditPopup={noop}
            isOpen={true}
            isValid={true}
            annotation={createMockAnnotation()}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
          />
        );
        const widthInput = container.querySelector('#form-field-width');
        userEvent.clear(widthInput);
        userEvent.type(widthInput, '66');
        expect(widthInput).toHaveValue(66)
      });

      it('if entered width greater than page width, the width is set to page width', () => {
        const { container } = render(
          <TestFormFieldEditPopup
            fields={inputFields}
            flags={sampleFlags}
            closeFormFieldEditPopup={noop}
            isOpen={true}
            isValid={true}
            annotation={createMockAnnotation()}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
          />
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
            isOpen={true}
            isValid={true}
            annotation={createMockAnnotation()}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
          />
        );
        const heightInput = container.querySelector('#form-field-height');
        userEvent.clear(heightInput);
        userEvent.type(heightInput, '200');
        expect(heightInput).toHaveValue(200)
      });

      it('if entered height greater than page height, the height is set to page height', () => {
        const { container } = render(
          <TestFormFieldEditPopup
            fields={inputFields}
            flags={sampleFlags}
            closeFormFieldEditPopup={noop}
            isOpen={true}
            isValid={true}
            annotation={createMockAnnotation()}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
          />
        );
        const heightInput = container.querySelector('#form-field-height');
        userEvent.clear(heightInput);
        userEvent.type(heightInput, '888');
        const pageHeight = getPageHeight();
        expect(heightInput).toHaveValue(pageHeight);
      });

      it('if entered a height but then I click cancel, it resets to original height', () => {
        const dummyAnnotation = createMockAnnotation();
        const initialHeight = dummyAnnotation.Height;
        const { container } = render(
          <TestFormFieldEditPopup
            fields={inputFields}
            flags={sampleFlags}
            closeFormFieldEditPopup={noop}
            isOpen={true}
            isValid={true}
            annotation={dummyAnnotation}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
          />
        );

        //Enter new height, ensure annotation is updated
        const heightInput = container.querySelector('#form-field-height');
        userEvent.clear(heightInput);
        userEvent.type(heightInput, '150');
        expect(heightInput).toHaveValue(150)
        expect(dummyAnnotation.Height).toEqual(150);

        //Now cancel, so height should revert to original values
        const cancelButton = container.querySelector('.cancel-form-field-button');
        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(cancelButton);

        expect(dummyAnnotation.Height).toEqual(initialHeight);
      });

      it('if entered a width but then I click cancel, it resets to original width', () => {
        const dummyAnnotation = createMockAnnotation();
        const initialWidth = dummyAnnotation.Width;
        const { container } = render(
          <TestFormFieldEditPopup
            fields={inputFields}
            flags={sampleFlags}
            closeFormFieldEditPopup={noop}
            isOpen={true}
            isValid={true}
            annotation={dummyAnnotation}
            redrawAnnotation={noop}
            getPageHeight={getPageHeight}
            getPageWidth={getPageWidth}
          />
        );

        // Now enter a width, ensure annotation is updated
        const widthInput = container.querySelector('#form-field-width');
        userEvent.clear(widthInput);
        userEvent.type(widthInput, '200');
        expect(widthInput).toHaveValue(200);
        expect(dummyAnnotation.Width).toEqual(200);

        //Now cancel, so width  should revert to original values
        const cancelButton = container.querySelector('.cancel-form-field-button');
        expect(cancelButton).toBeInTheDocument();
        fireEvent.click(cancelButton);

        expect(dummyAnnotation.Width).toEqual(initialWidth);
      });
    });
  });
});