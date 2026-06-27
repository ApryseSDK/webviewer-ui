import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import mentionsManager from 'helpers/MentionsManager';
import { testProps, testPropsWithSkipAutoLink } from './NoteContent.stories';
import NoteContent from './NoteContent';
import NoteContext from '../Note/Context';
import initialState from 'src/redux/initialState';
import useCore from 'hooks/useCore';

jest.mock('lodash/debounce', () => {
  return (fn) => {
    const debounced = (...args) => fn(...args);
    debounced.cancel = jest.fn();
    return debounced;
  };
});

jest.mock('hooks/useCore', () => {
  const trigger = jest.fn();
  return () => ({
    core: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      getDisplayAuthor: jest.fn(() => 'Author'),
      getAnnotationManager: jest.fn(() => ({ trigger })),
      drawAnnotationsFromList: jest.fn(),
      getIsReadOnly: jest.fn(() => false),
      canModify: jest.fn(() => true),
      canModifyContents: jest.fn(() => true),
    },
  });
});

jest.mock('helpers/MentionsManager', () => ({
  getFormattedTextFromDeltas: jest.fn(() => 'edited value'),
  extractMentionDataFromStr: jest.fn(() => ({ plainTextValue: 'edited value', ids: [] })),
  extractMentionDataFromAnnot: jest.fn(() => ({ mentions: [] })),
  doesDeltaContainMention: jest.fn(() => false),
}));

jest.mock('helpers/ReplyAttachmentManager', () => ({
  setAnnotationAttachments: jest.fn(() => Promise.resolve()),
}));

jest.mock('helpers/officeEditorCommentHelper', () => ({
  updateOfficeEditorCommentMessage: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('helpers/setAnnotationRichTextStyle', () => jest.fn());
jest.mock('helpers/setReactQuillContent', () => jest.fn());

jest.mock('components/NoteTextarea', () => {
  const React = require('react');
  const MockNoteTextarea = React.forwardRef(({ value, onChange }, ref) => {
    const editor = {
      getContents: jest.fn(() => ({ ops: [{ insert: value || '' }] })),
      getLength: jest.fn(() => (value || '').length + 1),
      setText: jest.fn(),
      setSelection: jest.fn(),
    };
    const textarea = {
      getEditor: jest.fn(() => editor),
      focus: jest.fn(),
      editor,
    };

    if (typeof ref === 'function') {
      ref(textarea);
    } else if (ref) {
      ref.current = textarea;
    }

    return (
      <input
        aria-label="comment"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  });
  MockNoteTextarea.displayName = 'MockNoteTextarea';
  return MockNoteTextarea;
});

const TestNoteContent = withProviders(NoteContent);
const notSelectedProps = {
  ...testProps,
  isSelected: false,
};

const context = {
  pendingEditTextMap: { /* mocked values */ },
  pendingReplyMap: { /* mocked values */ },
  pendingAttachmentMap: { /* mocked values */ },
  isSelected: true, // Change to true if needed
  searchInput: 'mockedSearchInput',
  isOfficeEditorCommentAnnotation: false,
};

jest.mock('hooks/useCore', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// eslint-disable-next-line custom/no-hex-colors
const BLACK_HEX = '#000000';

const createAnnotation = ({
  initialContents = 'original note',
  initialMentionData = '',
} = {}) => {
  let contents = initialContents;
  let mentionData = initialMentionData;

  return {
    Id: 'annot-1',
    Author: 'Author',
    FillColor: { toString: () => BLACK_HEX, toHexString: () => BLACK_HEX },
    TextColor: null,
    StrokeColor: { toHexString: () => BLACK_HEX },
    PageNumber: 1,
    getReplies: jest.fn(() => []),
    getStatus: jest.fn(() => ''),
    getAssociatedNumber: jest.fn(() => 1),
    isReply: jest.fn(() => false),
    getContents: jest.fn(() => contents),
    setContents: jest.fn((next) => {
      contents = next;
    }),
    getRichTextStyle: jest.fn(() => ({})),
    getAttachments: jest.fn(() => []),
    getCustomData: jest.fn((key) => {
      if (key === 'trn-mention') {
        return mentionData;
      }
      if (key === 'trn-annot-preview') {
        return '';
      }
      return '';
    }),
    setCustomData: jest.fn((key, value) => {
      if (key === 'trn-mention') {
        mentionData = value;
      }
    }),
    getSkipAutoLink: jest.fn(() => false),
    disableSkipAutoLink: jest.fn(),
  };
};

const createContextValue = (overrides = {}) => ({
  isSelected: true,
  searchInput: '',
  resize: jest.fn(),
  pendingEditTextMap: {},
  pendingReplyMap: {},
  pendingAttachmentMap: {},
  onTopNoteContentClicked: jest.fn(),
  sortStrategy: 'date',
  showAnnotationNumbering: false,
  setPendingEditText: jest.fn(),
  noteFlyoutIdSuffix: '',
  setCurAnnotId: jest.fn(),
  deleteAttachment: jest.fn(),
  clearAttachments: jest.fn(),
  addAttachments: jest.fn(),
  isOfficeEditorCommentAnnotation: false,
  ...overrides,
});

const renderWithAutosave = (annotation, contextValue, propOverrides = {}) => {
  const AutosaveNoteContent = withProviders(NoteContent, {
    viewer: {
      autosaveEnabled: true,
      autosaveInterval: 100,
      activeDocumentViewerKey: 1,
      genericPanels: [],
      colorMap: {
        rectangle: {
          iconColor: 'StrokeColor',
        },
      },
      openElements: {
        notesPanel: true,
      },
    },
    officeEditor: {
      editMode: 'editing',
    },
  });

  return render(
    <NoteContext.Provider value={contextValue}>
      <AutosaveNoteContent
        annotation={annotation}
        isEditing
        setIsEditing={jest.fn()}
        editingKey="edit-1"
        isUnread={false}
        isNonReplyNoteRead={false}
        onReplyClicked={jest.fn()}
        isMultiSelected={false}
        isMultiSelectMode={false}
        handleMultiSelect={jest.fn()}
        isGroupMember={false}
        {...propOverrides}
      />
    </NoteContext.Provider>
  );
};

describe('NoteContent Component', () => {
  let useSelectorMock;

  beforeEach(() => {
    jest.clearAllMocks();
    useCore.mockReturnValue({
      core: {
        getAnnotationManager: jest.fn().mockReturnValue({
          getEditBoxManager: jest.fn().mockReturnValue({
            getEditor: jest.fn().mockReturnValue(null),
          }),
          trigger: jest.fn(),
          isFreeTextEditingEnabled: jest.fn().mockReturnValue(false),
        }),
        getDisplayAuthor: jest.fn().mockReturnValue('Mocked Author'),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        drawAnnotationsFromList: jest.fn(),
        getFormFieldCreationManager: jest.fn().mockReturnValue({
          isInFormFieldCreationMode: jest.fn().mockReturnValue(false),
        }),
        getIsReadOnly: jest.fn().mockReturnValue(false),
        canModify: jest.fn().mockReturnValue(true),
        canModifyContents: jest.fn().mockReturnValue(true),
        deleteAnnotations: jest.fn(),
      },
    });
    // We mock the redux call to always return "false" for isElementDisabled
    useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockImplementation((callback) => callback(initialState));
  });

  afterEach(() => {
    useSelectorMock.mockRestore();
  });

  it('Should not throw any errors when rendering storybook component', () => {
    expect(() => {
      render(
        <NoteContext.Provider value={context}>
          <TestNoteContent {...notSelectedProps}/>
        </NoteContext.Provider>
      );
    }).not.toThrow();
  });

  it('Should generate an <a> tag if a link is identified', () => {
    const { container } = render(
      <NoteContext.Provider value={context}>
        <TestNoteContent {...notSelectedProps}/>
      </NoteContext.Provider>
    );

    expect(container.querySelector('a')).toBeInTheDocument();
  });

  it('Should not throw any errors when the annotation has SkipURLIdentification set to true', () => {
    expect(() => {
      render(
        <NoteContext.Provider value={context}>
          <TestNoteContent {...testPropsWithSkipAutoLink}/>
        </NoteContext.Provider>
      );
    });
  });

  it('Should not generate an <a> tag if the annotation has SkipURLIdentification set to true', () => {
    const { container } = render(
      <NoteContext.Provider value={context}>
        <TestNoteContent {...testPropsWithSkipAutoLink}/>
      </NoteContext.Provider>
    );
    expect(container.querySelector('a')).not.toBeInTheDocument();
  });
});

describe('NoteContent autosave behavior', () => {
  beforeEach(() => {
    const AnnotationFallback = class {};
    const EventHandler = class {
      triggerAsync = jest.fn(() => Promise.resolve());
    };
    window.Core = {
      EventHandler,
      Annotations: {
        FreeTextAnnotation: class {},
        Link: class {},
        SignatureWidgetAnnotation: class {},
      },
    };
    window.Core.Annotations = new Proxy(window.Core.Annotations, {
      get(target, prop) {
        if (!(prop in target)) {
          target[prop] = AnnotationFallback;
        }
        return target[prop];
      },
    });
    mentionsManager.getFormattedTextFromDeltas.mockReturnValue('edited value');
    mentionsManager.extractMentionDataFromStr.mockReturnValue({ plainTextValue: 'edited value', ids: [] });
    mentionsManager.extractMentionDataFromAnnot.mockReturnValue({ mentions: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('autosave clears pending edit state without rendering inline saved text', async () => {
    const annotation = createAnnotation();
    const contextValue = createContextValue();
    renderWithAutosave(annotation, contextValue);

    fireEvent.change(screen.getByRole('textbox', { name: /comment/i }), {
      target: { value: 'edited value' },
    });

    await waitFor(() => {
      expect(contextValue.setPendingEditText).toHaveBeenCalledWith(undefined, annotation.Id);
    });

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('restores baseline content when cancel is clicked after autosave edit', async () => {
    const annotation = createAnnotation();
    const contextValue = createContextValue();
    const setIsEditing = jest.fn();

    renderWithAutosave(annotation, contextValue, { setIsEditing });

    fireEvent.change(screen.getByRole('textbox', { name: /comment/i }), {
      target: { value: 'edited value' },
    });

    await waitFor(() => {
      expect(annotation.setContents).toHaveBeenCalledWith('edited value');
    });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(annotation.setContents).toHaveBeenCalledWith('original note');
    expect(setIsEditing).toHaveBeenCalledWith(false, 'edit-1');
  });

  it('keeps existing saved content when cancel is clicked without new edits', () => {
    const annotation = createAnnotation();
    const contextValue = createContextValue();
    const setIsEditing = jest.fn();

    renderWithAutosave(annotation, contextValue, { setIsEditing });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(annotation.setContents).toHaveBeenCalledTimes(1);
    expect(annotation.setContents).toHaveBeenCalledWith('original note');
    expect(setIsEditing).toHaveBeenCalledWith(false, 'edit-1');
  });

  it('drops stale baseline when editing UI unmounts before a later remount', async () => {
    const annotation = createAnnotation();
    const setIsEditing = jest.fn();

    const firstRender = renderWithAutosave(annotation, createContextValue(), { setIsEditing });
    fireEvent.change(screen.getByRole('textbox', { name: /comment/i }), {
      target: { value: 'edited value' },
    });

    await waitFor(() => {
      expect(annotation.setContents).toHaveBeenCalledWith('edited value');
    });

    firstRender.unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));

    renderWithAutosave(annotation, createContextValue(), { setIsEditing });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(annotation.setContents).toHaveBeenCalledTimes(2);
    expect(annotation.setContents).toHaveBeenLastCalledWith('edited value');
  });

  it('falls back to annotation content and mention data when baseline is unavailable', () => {
    const mentionData = JSON.stringify({ contents: 'original note', ids: ['user-1'] });
    const annotation = createAnnotation({ initialMentionData: mentionData });
    const contextValue = createContextValue();
    const setIsEditing = jest.fn();

    const mapGet = Map.prototype.get;
    const mapGetSpy = jest.spyOn(Map.prototype, 'get').mockImplementation(function(key) {
      if (key === '1:annot-1') {
        return undefined;
      }
      return mapGet.call(this, key);
    });

    renderWithAutosave(annotation, contextValue, { setIsEditing });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(annotation.setContents).toHaveBeenCalledWith('original note');
    expect(annotation.setCustomData).toHaveBeenCalledWith('trn-mention', mentionData);

    mapGetSpy.mockRestore();
  });
});