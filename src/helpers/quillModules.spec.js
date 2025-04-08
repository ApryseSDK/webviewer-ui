import { fireEvent } from '@testing-library/react';
import { BlurInputModule } from './quillModules';

describe('BlurInputModule', () => {
  let mockQuill, mockContainer, noteContainer, moduleInstance, previousButton, nextButton;

  beforeEach(() => {
    // Mock Quill editor container
    mockContainer = document.createElement('div');
    mockContainer.classList.add('ql-container', 'ql-snow');
    mockContainer.focus = jest.fn();

    noteContainer = document.createElement('div');
    noteContainer.classList.add('Note');
    noteContainer.appendChild(mockContainer);

    previousButton = document.createElement('button');
    previousButton.className = 'modular-ui';
    noteContainer.insertBefore(previousButton, mockContainer);

    nextButton = document.createElement('button');
    nextButton.className = 'modular-ui';
    noteContainer.appendChild(nextButton);
    document.body.appendChild(noteContainer);

    mockQuill = {
      root: mockContainer,
      container: mockContainer,
      blur: jest.fn(),
      focus: jest.fn(),
    };

    moduleInstance = new BlurInputModule(mockQuill);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('Pressing Escape should blur Quill editor and allow focus movement', () => {
    const blurQuillMock = jest.spyOn(moduleInstance, 'blurQuill');
    fireEvent.keyDown(noteContainer, { key: 'Escape' });

    expect(mockQuill.blur).toHaveBeenCalled();
    expect(mockContainer.tabIndex).toBe(0);
    expect(mockQuill.container.focus).toHaveBeenCalled();
    expect(blurQuillMock).toHaveBeenCalled();
  });

  test('should move focus forward on Tab key press after blur the Quill editor', () => {
    const moveFocusMock = jest.spyOn(moduleInstance, 'moveFocus');
    fireEvent.keyDown(noteContainer, { key: 'Escape' });
    fireEvent.keyDown(noteContainer, { key: 'Tab' });

    expect(document.activeElement).toBe(nextButton);
    expect(moveFocusMock).toHaveBeenCalled();
  });

  test('should move focus backwards on Shift + Tab key press after blur the Quill editor', () => {
    const moveFocusMock = jest.spyOn(moduleInstance, 'moveFocus');
    fireEvent.keyDown(noteContainer, { key: 'Escape' });
    fireEvent.keyDown(noteContainer, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(previousButton);
    expect(moveFocusMock).toHaveBeenCalled();
  });
});