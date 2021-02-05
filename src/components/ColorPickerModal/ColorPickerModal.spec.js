import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ColorPickerModal from './ColorPickerModal';
import { Basic } from './ColorPickerModal.stories';

// wrap story component with i18n provider, so component can use useTranslation()
const BasicColorPickerModalStory = withI18n(Basic);
// wrap base component with i81n provider and mock redux
const TestColorPickerModal = withProviders(ColorPickerModal);

jest.mock('react-color', () => {
  return {
    SketchPicker: function MockComponent() {
      return (<div className="sketch-picker">Mock for SketchPicker</div>);
    }
  };
});

describe('ColorPickerModal', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicColorPickerModalStory />);
    }).not.toThrow();
  });

  it('Component should not throw any errors without props', () => {
    expect(() => {
      render(<TestColorPickerModal />);
    }).not.toThrow();
  });

  it('The Color Picker Modal should not render when disabled', () => {
    const { container } = render(<TestColorPickerModal isDisabled={true} />);
    // Verify that ColorPickerModal class is not in the document
    expect(container.querySelector('.ColorPickerModal')).not.toBeInTheDocument();
  });

  it('The Color Picker Modal should render when enabled', () => {
    const { container } = render(<TestColorPickerModal isDisabled={false} />);
    // Verify that ColorPickerModal related classes are in the document
    expect(container.querySelector('.ColorPickerModal')).toBeInTheDocument();
    expect(container.querySelector('.sketch-picker')).toBeInTheDocument();
  });

  it('Test save & cancel buttons work', () => {
    const handleChangeSave = jest.fn();
    const handleChangeCancel = jest.fn();
    const { container } = render(
      <TestColorPickerModal
        isDisabled={false}
        handleChangeSave={handleChangeSave}
        handleChangeCancel={handleChangeCancel}
      />,
    );
    // Verify that ColorPickerModal related classes are in the document
    expect(container.querySelector('.ColorPickerModal')).toBeInTheDocument();
    expect(container.querySelector('.sketch-picker')).toBeInTheDocument();

    const saveButton = container.querySelector('.save-button');
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    expect(handleChangeSave).toBeCalled();

    const cancelButton = container.querySelector('.cancel-button');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(handleChangeCancel).toBeCalled();
  });
});
