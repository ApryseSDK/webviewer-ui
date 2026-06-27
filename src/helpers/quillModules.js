import { Quill } from 'react-quill-new';

// Overriding clipboard module to fix cursor issue after pasting text
const Clipboard = Quill.import('modules/clipboard');
const { quillShadowDOMWorkaround } = window.Core;

export class QuillPasteExtra extends Clipboard {
  constructor(quill, options) {
    quillShadowDOMWorkaround(quill);
    super(quill, options);
  }
}

// We override the default keyboard module to disable the list autofill feature
const Keyboard = Quill.import('modules/keyboard');

export class CustomKeyboard extends Keyboard {
  static DEFAULTS = {
    ...Keyboard.DEFAULTS,
    bindings: {
      ...Keyboard.DEFAULTS.bindings,
      'list autofill': undefined,
    }
  };
}

export class BlurInputModule {
  constructor(quill) {
    this.quill = quill;
    this.noteContainer = quill.root.closest('.Note');
    this.shouldSkipInput = false;

    this.noteContainer?.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.blurQuill();
    } else if (event.key === 'Tab' && this.shouldSkipInput) {
      const didMoveFocus = this.moveFocus(event.shiftKey);
      if (didMoveFocus) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  blurQuill() {
    this.shouldSkipInput = true;
    this.quill.blur();
    this.quill.container.tabIndex = 0;
    this.quill.container.focus();
  }

  isEditorInternalElement(element) {
    if (!element) {
      return false;
    }

    if (element === this.quill.container) {
      return true;
    }

    // Skip formatting toolbar controls and note expand/select control when exiting editor focus.
    if (element.closest('.ql-toolbar') || element.classList.contains('note-button')) {
      return true;
    }

    return false;
  }

  moveFocus(backwards) {
    // .ql-container.ql-snow is the quill editor selector
    const focusableElements = Array.from(
      this.noteContainer.querySelectorAll('.ql-container.ql-snow, button')
    );
    const activeElement = document.activeElement;
    const editorContainerFromActive = focusableElements.find((el) =>
      el.classList?.contains('ql-container') && el.contains(activeElement)
    );
    const currentElement = editorContainerFromActive || this.quill.container;
    const currentIndex = focusableElements.indexOf(currentElement);
    let didMoveFocus = false;

    if (currentIndex !== -1) {
      const step = backwards ? -1 : 1;
      for (let i = currentIndex + step; i >= 0 && i < focusableElements.length; i += step) {
        const nextElement = focusableElements[i];
        if (this.isEditorInternalElement(nextElement)) {
          continue;
        }

        nextElement.focus();
        didMoveFocus = true;
        break;
      }
    }

    this.shouldSkipInput = false;
    this.quill.container.tabIndex = -1;
    return didMoveFocus;
  }
}
