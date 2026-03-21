import onOfficeEditorCommentAdded from './onOfficeEditorCommentAdded';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'src/constants/dataElement';

jest.mock('actions');
jest.mock('selectors');

describe('onOfficeEditorCommentAdded', () => {
  const mockStore = (state = {}) => ({
    getState: () => state,
    dispatch: jest.fn(),
  });

  const mockCore = (annotation = { Id: '1' }) => ({
    deselectAllAnnotations: jest.fn(),
    getAnnotationById: jest.fn(() => annotation),
    selectAnnotation: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    actions.openElement = jest.fn((element) => ({ type: 'OPEN_ELEMENT', element }));
    actions.triggerNoteEditing = jest.fn(() => ({ type: 'TRIGGER_NOTE_EDITING' }));
    selectors.isElementOpen.mockReturnValue(false);
    selectors.isElementDisabled.mockImplementation((_, element) => element === DataElements.OFFICE_EDITOR_COMMENT_PANEL);
  });

  it('should return early when the Office Editor comment panel and inline comment popup are disabled', () => {
    selectors.isElementDisabled.mockReturnValue(true);
    const store = mockStore();
    const core = mockCore();
    const handler = onOfficeEditorCommentAdded(store, core);
    handler('1');

    expect(core.deselectAllAnnotations).not.toHaveBeenCalled();
    expect(core.getAnnotationById).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should return early when the annotation is not found', () => {
    selectors.isElementDisabled.mockReturnValue(false);
    const store = mockStore();
    const core = mockCore(null);
    const handler = onOfficeEditorCommentAdded(store, core);
    handler('1');

    expect(core.deselectAllAnnotations).toHaveBeenCalled();
    expect(core.selectAnnotation).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not open the popup when the comment panel is already open', () => {
    selectors.isElementDisabled.mockReturnValue(false);
    selectors.isElementOpen.mockReturnValue(true);
    const store = mockStore();
    const core = mockCore();
    const handler = onOfficeEditorCommentAdded(store, core);
    handler('1');

    expect(actions.openElement).not.toHaveBeenCalled();
    expect(core.selectAnnotation).toHaveBeenCalledWith({ Id: '1' });
    expect(actions.triggerNoteEditing).toHaveBeenCalled();
  });

  it('should open the Office Editor comment panel when inline comments are disabled', () => {
    selectors.isElementDisabled.mockImplementation((_, element) => element === DataElements.INLINE_COMMENT_POPUP);
    const store = mockStore();
    const core = mockCore();
    const handler = onOfficeEditorCommentAdded(store, core);
    handler('1');

    expect(actions.openElement).toHaveBeenCalledWith(DataElements.OFFICE_EDITOR_COMMENT_PANEL);
    expect(core.selectAnnotation).toHaveBeenCalledWith({ Id: '1' });
    expect(actions.triggerNoteEditing).toHaveBeenCalled();
  });

  it('should open the inline comment popup when inline comments are enabled', () => {
    selectors.isElementDisabled.mockReturnValue(false);
    const store = mockStore();
    const core = mockCore();
    const handler = onOfficeEditorCommentAdded(store, core);
    handler('1');

    expect(actions.openElement).toHaveBeenCalledWith(DataElements.INLINE_COMMENT_POPUP);
    expect(core.selectAnnotation).toHaveBeenCalledWith({ Id: '1' });
    expect(actions.triggerNoteEditing).toHaveBeenCalled();
  });
});

