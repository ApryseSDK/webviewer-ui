import onToolUpdated from './onToolUpdated';
import core from 'core';
import localStorageManager from 'helpers/localStorageManager';

jest.mock('core', () => ({
  getToolMode: jest.fn(),
  isFullPDFEnabled: jest.fn(),
}));

jest.mock('actions', () => ({
  setActiveToolStyles: jest.fn((s) => ({ type: 'SET_ACTIVE_TOOL_STYLES', payload: s })),
  setEnableSnapMode: jest.fn((p) => ({ type: 'SET_ENABLE_SNAP_MODE', payload: p })),
}));

jest.mock('helpers/localStorageManager', () => ({
  setItemSynchronous: jest.fn(),
  getItemSynchronous: jest.fn(),
}));

jest.mock('helpers/getRootNode', () => ({
  getInstanceID: jest.fn(() => 'default-instance'),
}));

jest.mock('i18next', () => ({ dir: jest.fn(() => 'ltr') }));

describe('onToolUpdated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    core.isFullPDFEnabled.mockReturnValue(false);
    core.getToolMode.mockReturnValue(null);
  });

  it('stores styles under the captured instanceId, not the live getRootNode result', () => {
    const dispatch = jest.fn();
    const tool = { name: 'AnnotationCreateRectangle', defaults: { StrokeThickness: 2 } };

    onToolUpdated(dispatch, 'instance-a')(tool);

    expect(localStorageManager.setItemSynchronous).toHaveBeenCalledWith(
      'instance-a-toolData-AnnotationCreateRectangle',
      JSON.stringify(tool.defaults),
    );
  });

  it('falls back to getInstanceID() when no instanceId is explicitly provided', () => {
    const dispatch = jest.fn();
    const tool = { name: 'AnnotationCreateRectangle', defaults: { StrokeThickness: 3 } };

    onToolUpdated(dispatch)(tool);

    expect(localStorageManager.setItemSynchronous).toHaveBeenCalledWith(
      'default-instance-toolData-AnnotationCreateRectangle',
      JSON.stringify(tool.defaults),
    );
  });
});
