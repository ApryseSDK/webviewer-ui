import { Quill } from 'react-quill';

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
      event.preventDefault();
      this.moveFocus(event.shiftKey);
    }
  };

  blurQuill() {
    this.shouldSkipInput = true;
    this.quill.blur();
    this.quill.container.tabIndex = 0;
    this.quill.container.focus();
  }

  moveFocus(backwards) {
    // .ql-container.ql-snow is the quill editor selector
    const focusableElements = Array.from(
      this.noteContainer.querySelectorAll('.ql-container.ql-snow, button.modular-ui')
    );
    const currentIndex = focusableElements.indexOf(this.quill.container);

    if (currentIndex !== -1) {
      const newIndex = backwards ? currentIndex - 1 : currentIndex + 1;
      focusableElements[newIndex]?.focus();
    }

    this.shouldSkipInput = false;
    this.quill.container.tabIndex = -1;
  }
}
