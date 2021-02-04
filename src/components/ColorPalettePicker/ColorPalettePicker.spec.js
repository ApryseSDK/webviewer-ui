import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ColorPalettePicker from './ColorPalettePicker';
import { Basic } from './ColorPalettePicker.stories';

// wrap story component with i18n provider, so component can use useTranslation()
const BasicColorPalettePickerStory = withI18n(Basic);
// wrap base component with i81n provider and mock redux
const TestColorPalettePicker = withProviders(ColorPalettePicker);

function noop() {}

const customColors = ["#00000"]

describe('ColorPalettePicker', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicColorPalettePickerStory />);
    }).not.toThrow();
  });

  it('Component should not throw any errors without props', () => {
    expect(() => {
      render(<TestColorPalettePicker getHexColor={noop} findCustomColorsIndex={noop} setColorToBeDeleted={noop} />);
    }).not.toThrow();
  });

  it('Should if the Color Pallette Picker renders', () => {
    const { container } = render(
      <TestColorPalettePicker getHexColor={noop} findCustomColorsIndex={noop} setColorToBeDeleted={noop} />,
    );
    // Verify that ColorPalettePicker related classes are in the document
    expect(container.querySelector('.colorPickerController')).toBeInTheDocument();
  });

  it('Test add color button works', () => {
    const openColorPicker = jest.fn();
    const { container } = render(
      <TestColorPalettePicker getHexColor={noop} findCustomColorsIndex={noop} setColorToBeDeleted={noop} openColorPicker={openColorPicker} enableEdit={true}/>
    );
    // Verify that ColorPalettePicker related classes are in the document
    expect(container.querySelector('.colorPickerController')).toBeInTheDocument();

    const addButton = container.querySelector('#addCustomColor');
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(openColorPicker).toBeCalled();
    
  });

  it('Test no remove color button when there is not custom colors', () => {
    const openDeleteModal = jest.fn();
    const { container } = render(
      <TestColorPalettePicker getHexColor={noop} findCustomColorsIndex={noop} setColorToBeDeleted={noop} openDeleteModal={openDeleteModal}/>
    );
    // Verify that ColorPalettePicker related classes are in the document
    expect(container.querySelector('.colorPickerController')).toBeInTheDocument();

    const removeButton = container.querySelector('#removeCustomColor');
    // button shouldn't render
    expect(removeButton).not.toBeInTheDocument();
  });

  it('Test remove color button does nothing if no color is selected', () => {
    const openDeleteModal = jest.fn();
    const { container } = render(
      <TestColorPalettePicker getHexColor={noop} findCustomColorsIndex={noop} setColorToBeDeleted={noop} openDeleteModal={openDeleteModal} customColors={customColors} colorToBeDeleted={false} enableEdit={true}/>
    );
    // Verify that ColorPalettePicker related classes are in the document
    expect(container.querySelector('.colorPickerController')).toBeInTheDocument();

    const removeButton = container.querySelector('#removeCustomColor');
    expect(removeButton).toBeInTheDocument();
    fireEvent.click(removeButton);
    expect(openDeleteModal).not.toBeCalled();
  });

  it('Test remove color button works', () => {
    const openDeleteModal = jest.fn();
    const { container } = render(
      <TestColorPalettePicker getHexColor={noop} findCustomColorsIndex={noop} setColorToBeDeleted={noop} openDeleteModal={openDeleteModal} customColors={customColors} colorToBeDeleted={true} enableEdit={true}/>
    );
    // Verify that ColorPalettePicker related classes are in the document
    expect(container.querySelector('.colorPickerController')).toBeInTheDocument();

    const removeButton = container.querySelector('#removeCustomColor');
    expect(removeButton).toBeInTheDocument();
    fireEvent.click(removeButton);
    expect(openDeleteModal).toBeCalled();
    
  });

  it('Test remove/add color button should not work when enableEdit=false', () => {
    const openDeleteModal = jest.fn();
    const { container } = render(
      <TestColorPalettePicker enableEdit={false} getHexColor={noop} findCustomColorsIndex={noop} setColorToBeDeleted={noop} openDeleteModal={openDeleteModal} customColors={customColors} colorToBeDeleted={true} />
    );
    // Verify that ColorPalettePicker related classes are in the document
    expect(container.querySelector('.colorPickerController')).toBeInTheDocument();

    const removeButton = container.querySelector('#removeCustomColor');
    expect(removeButton).not.toBeInTheDocument();
    const addButton = container.querySelector('#addCustomColor');
    expect(addButton).not.toBeInTheDocument();
    
  });
});
