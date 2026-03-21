import onStickyAnnotationAdded from './onStickyAnnotationAdded';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';
import * as useCore from 'hooks/useCore/useCore';

describe('onStickyAnnotationAdded', () => {
  let store;
  let mockCore;
  const mockAnnotation = { Id: 'sticky1' };

  beforeEach(() => {
    jest.clearAllMocks();
    store = { dispatch: jest.fn(), getState: () => ({ viewer: {} }) };
    mockCore = { setToolMode: jest.fn(), selectAnnotation: jest.fn() };
    jest.spyOn(useCore, 'createWrappedCore').mockReturnValue(mockCore);
    actions.setActiveToolGroup = jest.fn((group) => ({ type: 'SET_ACTIVE_TOOL_GROUP', payload: group }));
    actions.closeElement = jest.fn((el) => ({ type: 'CLOSE_ELEMENT', payload: el }));
    actions.openElement = jest.fn((el) => ({ type: 'OPEN_ELEMENT', payload: el }));
    actions.triggerNoteEditing = jest.fn(() => ({ type: 'TRIGGER_NOTE_EDITING' }));
    selectors.isElementDisabled = jest.fn().mockReturnValue(false);
    selectors.isElementOpen = jest.fn().mockReturnValue(false);
  });

  it('should return early when notes panel is disabled', () => {
    selectors.isElementDisabled.mockImplementation((_, el) => el === DataElements.NOTES_PANEL);
    onStickyAnnotationAdded(store, 1)(mockAnnotation);

    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockCore.setToolMode).not.toHaveBeenCalled();
    expect(mockCore.selectAnnotation).not.toHaveBeenCalled();
  });

  it('should close panels, select annotation and trigger note editing when notes panel is open', () => {
    selectors.isElementOpen.mockImplementation((_, el) => el === DataElements.NOTES_PANEL);
    onStickyAnnotationAdded(store, 1)(mockAnnotation);

    expect(actions.setActiveToolGroup).toHaveBeenCalledWith('');
    expect(actions.closeElement).toHaveBeenCalledWith('searchPanel');
    expect(actions.closeElement).toHaveBeenCalledWith(DataElements.REDACTION_PANEL);
    expect(actions.closeElement).toHaveBeenCalledWith('textEditingPanel');
    expect(mockCore.selectAnnotation).toHaveBeenCalledWith(mockAnnotation);
    expect(actions.triggerNoteEditing).toHaveBeenCalled();
  });

  it('should open notes panel when inline comment is disabled and notes panel is not open', () => {
    selectors.isElementDisabled.mockImplementation((_, el) => el === DataElements.INLINE_COMMENT_POPUP);
    onStickyAnnotationAdded(store, 1)(mockAnnotation);

    expect(actions.openElement).toHaveBeenCalledWith(DataElements.NOTES_PANEL);
  });

  it('should use different wrapped cores for different documentViewerKeys in multiviewer mode', () => {
    const mockCore2 = { setToolMode: jest.fn(), selectAnnotation: jest.fn() };
    selectors.isElementOpen.mockImplementation((_, el) => el === DataElements.NOTES_PANEL);

    onStickyAnnotationAdded(store, 1)(mockAnnotation);

    useCore.createWrappedCore.mockReturnValue(mockCore2);
    onStickyAnnotationAdded(store, 2)(mockAnnotation);

    expect(mockCore.setToolMode).toHaveBeenCalled();
    expect(mockCore.selectAnnotation).toHaveBeenCalledWith(mockAnnotation);
    expect(mockCore2.setToolMode).toHaveBeenCalled();
    expect(mockCore2.selectAnnotation).toHaveBeenCalledWith(mockAnnotation);
  });
});
