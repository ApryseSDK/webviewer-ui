import onAnnotationNumberingUpdated from './onAnnotationNumberingUpdated';
import actions from 'actions';

jest.mock('actions');

describe('onAnnotationNumberingUpdated', () => {
  let mockDispatch;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn();
    actions.setAnnotationNumbering = jest.fn((value) => ({
      type: 'SET_ANNOTATION_NUMBERING',
      payload: { isAnnotationNumberingEnabled: value },
    }));
  });

  it('returns a function that accepts dispatch and returns a callback', () => {
    const callback = onAnnotationNumberingUpdated(mockDispatch);
    expect(typeof callback).toBe('function');
  });

  it('dispatches setAnnotationNumbering(true) when event fires with true', () => {
    const callback = onAnnotationNumberingUpdated(mockDispatch);
    callback(true);

    expect(actions.setAnnotationNumbering).toHaveBeenCalledWith(true);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_ANNOTATION_NUMBERING',
      payload: { isAnnotationNumberingEnabled: true },
    });
  });

  it('dispatches setAnnotationNumbering(false) when event fires with false', () => {
    const callback = onAnnotationNumberingUpdated(mockDispatch);
    callback(false);

    expect(actions.setAnnotationNumbering).toHaveBeenCalledWith(false);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_ANNOTATION_NUMBERING',
      payload: { isAnnotationNumberingEnabled: false },
    });
  });

  it('each dispatch call is independent for different instances', () => {
    const dispatch1 = jest.fn();
    const dispatch2 = jest.fn();

    onAnnotationNumberingUpdated(dispatch1)(true);
    onAnnotationNumberingUpdated(dispatch2)(false);

    expect(dispatch1).toHaveBeenCalledTimes(1);
    expect(dispatch2).toHaveBeenCalledTimes(1);
    expect(dispatch1).not.toHaveBeenCalledWith(dispatch2.mock.calls[0][0]);
  });
});
