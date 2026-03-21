import onCaretAnnotationAdded from './onCaretAnnotationAdded';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';
import * as useCore from 'hooks/useCore/useCore';

describe('onCaretAnnotationAdded', () => {
  let store;
  let mockCore;
  const mockAnnotation = { Id: 'annot1' };

  beforeEach(() => {
    jest.clearAllMocks();
    store = { dispatch: jest.fn(), getState: () => ({ viewer: {} }) };
    mockCore = { selectAnnotation: jest.fn() };
    jest.spyOn(useCore, 'createWrappedCore').mockReturnValue(mockCore);
    actions.closeElement = jest.fn((el) => ({ type: 'CLOSE_ELEMENT', payload: el }));
    actions.openElement = jest.fn((el) => ({ type: 'OPEN_ELEMENT', payload: el }));
    actions.triggerNoteEditing = jest.fn(() => ({ type: 'TRIGGER_NOTE_EDITING' }));
    selectors.isElementDisabled = jest.fn().mockReturnValue(false);
    selectors.isElementOpen = jest.fn().mockReturnValue(false);
  });

  it('should return early when notes panel is disabled', () => {
    selectors.isElementDisabled.mockImplementation((_, el) => el === DataElements.NOTES_PANEL);
    onCaretAnnotationAdded(store, 1)(mockAnnotation);

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockCore.selectAnnotation).not.toHaveBeenCalled();
  });

  it('should close panels, select annotation and trigger note editing when notes panel is open', () => {
    selectors.isElementOpen.mockImplementation((_, el) => el === DataElements.NOTES_PANEL);
    onCaretAnnotationAdded(store, 1)(mockAnnotation);

    expect(actions.closeElement).toHaveBeenCalledWith('searchPanel');
    expect(actions.closeElement).toHaveBeenCalledWith(DataElements.REDACTION_PANEL);
    expect(mockCore.selectAnnotation).toHaveBeenCalledWith(mockAnnotation);
    expect(actions.triggerNoteEditing).toHaveBeenCalled();
  });

  it('should open notes panel when inline comment is disabled and notes panel is not open', () => {
    selectors.isElementDisabled.mockImplementation((_, el) => el === DataElements.INLINE_COMMENT_POPUP);
    onCaretAnnotationAdded(store, 1)(mockAnnotation);

    expect(actions.openElement).toHaveBeenCalledWith(DataElements.NOTES_PANEL);
  });

  it('should use different wrapped cores for different documentViewerKeys in multiviewer mode', () => {
    const mockCore2 = { selectAnnotation: jest.fn() };
    onCaretAnnotationAdded(store, 1)(mockAnnotation);

    useCore.createWrappedCore.mockReturnValue(mockCore2);
    onCaretAnnotationAdded(store, 2)(mockAnnotation);

    expect(mockCore.selectAnnotation).toHaveBeenCalledWith(mockAnnotation);
    expect(mockCore2.selectAnnotation).toHaveBeenCalledWith(mockAnnotation);
  });
});
