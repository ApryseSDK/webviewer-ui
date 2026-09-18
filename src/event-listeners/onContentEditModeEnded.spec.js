import onContentEditModeEnded from './onContentEditModeEnded';
import hotkeys from 'hotkeys-js';
import selectors from 'selectors';
import core from 'core';
import actions from 'actions';
import hotkeysManager, { defaultHotkeysScope } from 'helpers/hotkeysManager';
import { CONTENT_EDIT_SCOPE } from 'constants/contentEdit';
import DataElements from 'constants/dataElement';

jest.mock('actions', () => ({
  setIsContentEditingEnabled: jest.fn((p) => ({ type: 'SET_IS_CONTENT_EDITING_ENABLED', payload: p })),
  enableElement: jest.fn((dataElement) => ({ type: 'ENABLE_ELEMENT', payload: { dataElement } })),
}));

jest.mock('hotkeys-js', () => {
  const fn = jest.fn();
  fn.unbind = jest.fn();
  fn.setScope = jest.fn();
  return fn;
});

jest.mock('selectors', () => ({
  getActiveDocumentViewerKey: jest.fn(),
  getFeatureFlags: jest.fn(),
  getActiveCustomRibbon: jest.fn(),
}));

jest.mock('core', () => ({
  getDocumentViewer: jest.fn(),
  getToolMode: jest.fn(),
  setToolMode: jest.fn(),
}));

jest.mock('helpers/hotkeysManager', () => ({
  __esModule: true,
  defaultHotkeysScope: 'viewer',
  default: {
    contentEditStyleHotkeyHandler: null,
    contentEditStyleHotkeyDocument: null,
    keyHandlerMap: {},
    getDefaultKeyHandler: jest.fn(),
    on: jest.fn(),
  },
}));

describe('onContentEditModeEnded', () => {
  const dispatch = jest.fn();
  let ownerDocument;
  const store = { dispatch, getState: jest.fn(() => ({})) };

  beforeEach(() => {
    ownerDocument = { removeEventListener: jest.fn() };
    selectors.getActiveDocumentViewerKey.mockReturnValue(1);
    selectors.getFeatureFlags.mockReturnValue({ customizableUI: true });
    selectors.getActiveCustomRibbon.mockReturnValue(DataElements.EDIT_TEXT_TOOLBAR_GROUP);

    core.getDocumentViewer.mockReturnValue({
      getViewerElement: () => ({ ownerDocument }),
    });
    core.getToolMode.mockReturnValue({ name: 'Pan' });

    hotkeysManager.contentEditStyleHotkeyHandler = jest.fn();
    hotkeysManager.contentEditStyleHotkeyDocument = ownerDocument;
    hotkeysManager.getDefaultKeyHandler.mockReturnValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    hotkeysManager.contentEditStyleHotkeyHandler = null;
    hotkeysManager.contentEditStyleHotkeyDocument = null;
  });

  it('removes native style handler and restores default scope', () => {
    onContentEditModeEnded(dispatch, store)();

    expect(ownerDocument.removeEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
      true
    );
    expect(hotkeys.unbind).toHaveBeenCalledWith('*', CONTENT_EDIT_SCOPE);
    expect(hotkeys.setScope).toHaveBeenCalledWith(defaultHotkeysScope);
    expect(hotkeysManager.on).not.toHaveBeenCalled();
  });

  it('sets tool mode to AnnotationEdit when customizable UI is enabled and current tool is different', () => {
    onContentEditModeEnded(dispatch, store)();

    expect(core.setToolMode).toHaveBeenCalledWith('AnnotationEdit');
  });

  it('does not set tool mode when current tool is already AnnotationEdit', () => {
    core.getToolMode.mockReturnValue({ name: 'AnnotationEdit' });

    onContentEditModeEnded(dispatch, store)();

    expect(core.setToolMode).not.toHaveBeenCalled();
  });

  it('does not set tool mode when the active ribbon is not the Edit Text ribbon', () => {
    selectors.getActiveCustomRibbon.mockReturnValue('toolbarGroup-Annotate');
    onContentEditModeEnded(dispatch, store)();
    expect(core.setToolMode).not.toHaveBeenCalled();
  });

  it('re-enables the Style Panel when Content Edit ends', () => {
    onContentEditModeEnded(dispatch, store)();
    expect(dispatch).toHaveBeenCalledWith(actions.enableElement(DataElements.STYLE_PANEL));
  });
});
