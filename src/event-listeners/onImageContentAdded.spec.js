import onImageContentAdded from './onImageContentAdded';
import actions from 'actions';
import * as useCore from 'hooks/useCore/useCore';

describe('onImageContentAdded', () => {
  let mockDispatch;
  let mockCore;
  const mockAnnotation = { Id: 'img1' };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    mockCore = { setToolMode: jest.fn(), selectAnnotation: jest.fn() };
    jest.spyOn(useCore, 'createWrappedCore').mockReturnValue(mockCore);
    actions.setActiveToolGroup = jest.fn((group) => ({ type: 'SET_ACTIVE_TOOL_GROUP', payload: group }));
  });

  it('should dispatch setActiveToolGroup with empty string', () => {
    onImageContentAdded(mockDispatch, 1)(mockAnnotation);

    expect(actions.setActiveToolGroup).toHaveBeenCalledWith('');
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should use different wrapped cores for different documentViewerKeys in multiviewer mode', () => {
    const mockCore2 = { setToolMode: jest.fn(), selectAnnotation: jest.fn() };
    onImageContentAdded(mockDispatch, 1)(mockAnnotation);

    useCore.createWrappedCore.mockReturnValue(mockCore2);
    onImageContentAdded(mockDispatch, 2)(mockAnnotation);

    expect(mockCore.setToolMode).toHaveBeenCalled();
    expect(mockCore.selectAnnotation).toHaveBeenCalledWith(mockAnnotation);
    expect(mockCore2.setToolMode).toHaveBeenCalled();
    expect(mockCore2.selectAnnotation).toHaveBeenCalledWith(mockAnnotation);
  });
});
