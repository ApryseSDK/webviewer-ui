import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextEditingPanel from './TextEditingPanel';
import core from 'core';

const TestTextEditingPanel = withProviders(TextEditingPanel);

const noop = () => { };

const mockProps = {
  handlePropertyChange: noop,
  handleTextFormatChange: noop,
  handleColorChange: noop,
  format: {
    bold: false,
    italic: false,
    underline: false,
  },
  undoRedoProperties: undefined,
};

core.getContentEditManager = () => ({
  isInContentEditMode: () => true,
});

describe('TextEditingPanel', () => {
  it('should render without undo/redo buttons', () => {
    render(<TestTextEditingPanel {...mockProps} />);
    const undoButton = screen.queryByRole('Undo', { name: 'Undo' });
    const redoButton = screen.queryByRole('Redo', { name: 'Redo' });
    expect(undoButton).not.toBeInTheDocument();
    expect(redoButton).not.toBeInTheDocument();
  });

  it('should render with undo/redo buttons disabled', () => {
    mockProps.undoRedoProperties = {
      canUndo: false,
      canRedo: false
    };

    render(<TestTextEditingPanel {...mockProps} />);
    const undoButton = screen.getByRole('button', { name: 'Undo' });
    const redoButton = screen.getByRole('button', { name: 'Redo' });
    expect(undoButton.disabled).toBe(true);
    expect(redoButton.disabled).toBe(true);
  });

  it('should render with undo/redo buttons enabled', () => {
    mockProps.undoRedoProperties = {
      canUndo: true,
      canRedo: true
    };

    render(<TestTextEditingPanel {...mockProps} />);
    const undoButton = screen.getByRole('button', { name: 'Undo' });
    const redoButton = screen.getByRole('button', { name: 'Redo' });
    expect(undoButton.disabled).toBe(false);
    expect(redoButton.disabled).toBe(false);
  });

  it('should render with undo enabled but redo disabled', () => {
    mockProps.undoRedoProperties = {
      canUndo: true,
      canRedo: false
    };

    render(<TestTextEditingPanel {...mockProps} />);
    const undoButton = screen.getByRole('button', { name: 'Undo' });
    const redoButton = screen.getByRole('button', { name: 'Redo' });
    expect(undoButton.disabled).toBe(false);
    expect(redoButton.disabled).toBe(true);
  });

  it('should render with undo disabled but redo enabled', () => {
    mockProps.undoRedoProperties = {
      canUndo: false,
      canRedo: true
    };

    render(<TestTextEditingPanel {...mockProps} />);
    const undoButton = screen.getByRole('button', { name: 'Undo' });
    const redoButton = screen.getByRole('button', { name: 'Redo' });
    expect(undoButton.disabled).toBe(true);
    expect(redoButton.disabled).toBe(false);
  });

  it('Should have h2 on header', () => {
    render(<TestTextEditingPanel {...mockProps} />);

    const element = screen.getByText('Text Styles');
    expect(element.tagName.toLocaleLowerCase()).toEqual('h2');
  });

  it('should fire undo handler when button is clicked', () => {
    mockProps.undoRedoProperties = {
      canUndo: true,
      handleUndo: jest.fn()
    };

    render(<TestTextEditingPanel {...mockProps} />);
    const undoButton = screen.getByRole('button', { name: 'Undo' });
    expect(undoButton.disabled).toBe(false);

    undoButton.click();
    expect(mockProps.undoRedoProperties.handleUndo).toHaveBeenCalled();
  });

  it('should fire redo handler when button is clicked', () => {
    mockProps.undoRedoProperties = {
      canRedo: true,
      handleRedo: jest.fn()
    };

    render(<TestTextEditingPanel {...mockProps} />);
    const redoButton = screen.getByRole('button', { name: 'Redo' });
    expect(redoButton.disabled).toBe(false);

    redoButton.click();
    expect(mockProps.undoRedoProperties.handleRedo).toHaveBeenCalled();
  });

  it('should call handlePropertyChange with correct selectedContentBox when a font size dropdown item is clicked', async () => {
    const checkIsCalled = jest.fn();
    const TestWrapper = () => {
      const [selectedContentBox, setSelectedContentBox] = useState(null);
      const handlePropertyChange = jest.fn(() => {
        checkIsCalled();
        expect(selectedContentBox).toEqual({ id: 1, text: 'Updated content' });
      });
      mockProps.handlePropertyChange = handlePropertyChange;
      mockProps.contentSelectMode = true;

      return (
        <div>
          <button
            data-testid="update-content-box"
            onClick={() => setSelectedContentBox({ id: 1, text: 'Updated content' })}
          >
            Update Content Box
          </button>
          <TestTextEditingPanel {...mockProps} />
        </div>
      );
    };

    render(<TestWrapper />);

    const updateContentBoxButton = screen.getByRole('button', { name: 'Update Content Box' });
    fireEvent.click(updateContentBoxButton);

    const fontSizeDropdown = screen.getByRole('combobox', { name: /Font Size/i });
    fireEvent.click(fontSizeDropdown);

    const fontSizeItem24 = screen.getByRole('option', { name: '196' });

    fireEvent.click(fontSizeItem24);
    expect(checkIsCalled).toHaveBeenCalled();
  });
});