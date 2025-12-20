import onUpdateAnnotationPermission from './onUpdateAnnotationPermission';
import selectors from 'selectors';
import core from 'core';

import getAnnotationCreateToolNames from 'helpers/getAnnotationCreateToolNames';
import actions from 'actions';

jest.mock('selectors');
jest.mock('core');
jest.mock('helpers/getAnnotationCreateToolNames');
jest.mock('actions');

const mockEnableTools = jest.fn();
const mockDisableTools = jest.fn();

jest.mock('src/apis/enableTools', () => jest.fn(() => mockEnableTools));
jest.mock('src/apis/disableTools', () => jest.fn(() => mockDisableTools));

const mockToolButtonObjects = {
  AnnotationCreateRectangle: { dataElement: 'rectangleToolButton' },
  AnnotationCreateEllipse: { dataElement: 'ellipseToolButton' },
  AnnotationCreateStamp: { dataElement: 'stampToolButton' },
};

const makeStore = (viewer) => ({
  getState: () => ({ viewer }),
  dispatch: jest.fn(),
});

beforeAll(() => {
  selectors.getToolButtonObjects.mockReturnValue(mockToolButtonObjects);
  getAnnotationCreateToolNames.mockReturnValue(Object.keys(mockToolButtonObjects));
});

beforeEach(() => {
  jest.clearAllMocks();
  actions.stashEnabledTools = jest.fn();
  selectors.isViewOnly.mockReturnValue(false);
  selectors.getIsCustomUIEnabled.mockReturnValue(true);
  selectors.isElementDisabled.mockReturnValue(false);
  core.getIsReadOnly.mockReturnValue(false);
  core.setToolMode = jest.fn();
});


describe('onUpdateAnnotationPermission', () => {
  it('should save enabled tools when entering readonly mode', () => {
    core.getIsReadOnly.mockReturnValue(true);
    selectors.isToolDisabled.mockImplementation((_, toolName) => (toolName) === 'AnnotationCreateStamp');
    const store = makeStore({
      enabledToolsStash: [],
    });
    onUpdateAnnotationPermission(store)();
    expect(actions.stashEnabledTools).toHaveBeenCalledWith(['AnnotationCreateRectangle', 'AnnotationCreateEllipse']);
    expect(mockDisableTools).toHaveBeenCalledWith(['AnnotationCreateRectangle', 'AnnotationCreateEllipse']);
  });

  it('should restore only previously enabled tools when exiting readonly mode', () => {
    core.getIsReadOnly.mockReturnValue(false);
    const store = makeStore({
      enabledToolsStash: ['AnnotationCreateRectangle', 'AnnotationCreateEllipse'],
    });
    onUpdateAnnotationPermission(store)();
    expect(mockEnableTools).toHaveBeenCalledWith(['AnnotationCreateRectangle', 'AnnotationCreateEllipse']);
    expect(actions.stashEnabledTools).toHaveBeenCalledWith([]);
  });

  it('should not stash enabled tools if stash is already set', () => {
    core.getIsReadOnly.mockReturnValue(true);
    selectors.isElementDisabled.mockImplementation(() => false);
    const store = makeStore({
      enabledToolsStash: [
        'AnnotationCreateRectangle',
        'AnnotationCreateEllipse',
        'AnnotationCreateStamp',
      ],
    });
    onUpdateAnnotationPermission(store)();
    expect(actions.stashEnabledTools).not.toHaveBeenCalled();
  });
});
