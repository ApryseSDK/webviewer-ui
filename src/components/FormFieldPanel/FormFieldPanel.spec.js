import React from 'react';
import { render, fireEvent, getByText, getByDisplayValue, screen } from '@testing-library/react';
import FormFieldPanel from './FormFieldPanel';
import { Basic } from './FormFieldPanel.stories';
import { inputFields, selectField, sampleFlags, indicator, INDICATOR_TEXT, createMockAnnotation } from '../FormFieldEditPopup/FormFieldEditPopup.spec';

const BasicFormFieldEditPanelStory = withI18n(Basic);
const TestFormFieldEditPanel = withProviders(FormFieldPanel);

function noop() { }


describe('FormFieldPanel', () => {
  describe('Component', () => {
    it('Story should not throw any errors', () => {
      expect(() => {
        render(<BasicFormFieldEditPanelStory />);
      }).not.toThrow();
    });

    describe('Renders Inputs and Flags', () => {
      let container;

      beforeEach(() => {
        const renderResult = render(
          <TestFormFieldEditPanel
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
        container = renderResult.container;
      });

      it('Renders an input for each of the Fields passed in', () => {
        expect(container.querySelectorAll('.text-input')).toHaveLength(inputFields.length);
      });

      it('Renders a checkbox input for each of the Field Flags passed in', () => {
        expect(container.querySelectorAll('.ui__choice__input')).toHaveLength(sampleFlags.length + 1);  // Including show indicator checkbox
      });
    });

    it('Renders select input correctly as a radio button group', () => {
      const { container } = render(
        <TestFormFieldEditPanel
          fields={selectField}
          flags={sampleFlags}
          closeFormFieldEditPanel={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          fieldProperties={{
            name: 'fieldName',
            value: 'fieldValue',
            radioButtonGroups: ['fieldName', 'fieldName2'],
          }}
          onRadioFieldNameChange={noop}
          indicator={indicator}
        />,
      );
      expect(container.querySelectorAll('.radio-group-label')).toHaveLength(selectField.length);
    });

    it('Should call handler to close panel when OK button is clicked', () => {
      const closeFormFieldEditPanel = jest.fn();
      const { container } = render(
        <TestFormFieldEditPanel
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPanel={closeFormFieldEditPanel}
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
      expect(closeFormFieldEditPanel).toBeCalled();
    });

    it('Should render text input with Warning if field is not valid', () => {
      const { container } = render(
        <TestFormFieldEditPanel
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPanel={noop}
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
        <TestFormFieldEditPanel
          fields={selectField}
          flags={sampleFlags}
          closeFormFieldEditPanel={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={indicator}
          validationMessage={'Field Name already exists'}
          fieldProperties={{
            name: 'fieldName',
            value: 'fieldValue',
            radioButtonGroups: ['fieldName', 'fieldName2'],
          }}
          onRadioFieldNameChange={noop}
        />,
      );
      getByText(container, 'Field Name already exists');
      expect(container.querySelector('.messageText')).toBeInTheDocument();
    });

    it('opens with correct indicator text', () => {
      const { container } = render(
        <TestFormFieldEditPanel
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPanel={noop}
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
      const { container } = render(
        <TestFormFieldEditPanel
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPanel={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={indicator}
        />,
      );
      const input = container.querySelector('#field-indicator-input');
      expect(input.getAttribute('aria-disabled')).toEqual('false');

      const checkbox = container.querySelector('#field-indicator');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox.getAttribute('aria-checked')).toEqual('true');
    });

    it('should have accessible for property group', () => {
      render(
        <TestFormFieldEditPanel
          fields={inputFields}
          flags={sampleFlags}
          closeFormFieldEditPanel={noop}
          isOpen
          isValid
          annotation={createMockAnnotation()}
          redrawAnnotation={noop}
          getPageHeight={noop}
          getPageWidth={noop}
          indicator={indicator}
        />,
      );
      const titleElement = screen.getByRole('heading', { name: 'Properties' });
      expect(titleElement).toHaveClass('property-title');
      expect(titleElement).toHaveAttribute('id', 'property-group');
      expect(titleElement.tagName).toBe('H2');

      screen.getByRole('group', { name: 'Properties' });
    });
  });
});
