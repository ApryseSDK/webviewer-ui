import getActiveDocumentViewerKeyAPI from '../../apis/getActiveDocumentViewerKey';
import setActiveDocumentViewerKeyAPI from '../../apis/setActiveDocumentViewerKey';
import actions from 'actions';
import selectors from 'selectors';
import fireEvent from 'helpers/fireEvent';
import Events from 'constants/events';

jest.mock('actions');
jest.mock('selectors');
jest.mock('helpers/fireEvent');

const mockCheckTypes = jest.fn();
global.window = global.window || {};
global.window.Core = {
  TYPES: {
    ONE_OF: (...values) => ({ type: 'ONE_OF', values }),
  },
  checkTypes: mockCheckTypes,
};

describe('Document Viewer Key APIs', () => {
  let mockStore;
  let mockGetState;
  let mockDispatch;

  beforeEach(() => {
    mockGetState = jest.fn();
    mockDispatch = jest.fn();
    mockStore = {
      getState: mockGetState,
      dispatch: mockDispatch,
    };

    mockCheckTypes.mockClear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.warn.mockRestore();
    console.error.mockRestore();
  });

  describe('getActiveDocumentViewerKey', () => {
    it('should return the active document viewer key from state', () => {
      const mockState = { activeDocumentViewerKey: 1 };
      mockGetState.mockReturnValue(mockState);
      selectors.getActiveDocumentViewerKey.mockReturnValue(1);

      const getActiveDocumentViewerKey = getActiveDocumentViewerKeyAPI(mockStore);
      const result = getActiveDocumentViewerKey();

      expect(result).toBe(1);
      expect(mockGetState).toHaveBeenCalled();
      expect(selectors.getActiveDocumentViewerKey).toHaveBeenCalledWith(mockState);
    });

    it('should return 2 when active viewer is 2', () => {
      const mockState = { activeDocumentViewerKey: 2 };
      mockGetState.mockReturnValue(mockState);
      selectors.getActiveDocumentViewerKey.mockReturnValue(2);

      const getActiveDocumentViewerKey = getActiveDocumentViewerKeyAPI(mockStore);
      const result = getActiveDocumentViewerKey();

      expect(result).toBe(2);
    });
  });

  describe('setActiveDocumentViewerKey', () => {
    let mockState;
    beforeEach(() => {
      actions.setActiveDocumentViewerKey = jest.fn((key) => ({ type: 'SET_ACTIVE_VIEWER', payload: key }));
      mockState = {};
      mockGetState.mockReturnValue(mockState);
      selectors.isMultiViewerMode.mockReturnValue(true);
    });

    it('should dispatch action and fire event when changing viewer in Multi-Viewer Mode', () => {
      selectors.getActiveDocumentViewerKey.mockReturnValue(1);

      const setActiveDocumentViewerKey = setActiveDocumentViewerKeyAPI(mockStore);
      setActiveDocumentViewerKey(2);

      expect(mockCheckTypes).toHaveBeenCalledWith(
        [2],
        [expect.objectContaining({ type: 'ONE_OF' })],
        'UI.setActiveDocumentViewerKey'
      );
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_ACTIVE_VIEWER', payload: 2 });
      expect(fireEvent).toHaveBeenCalledWith(Events.ACTIVE_DOCUMENT_VIEWER_CHANGED, {
        activeDocumentViewerKey: 2,
        previousDocumentViewerKey: 1,
      });
    });

    it('should not dispatch or fire event when setting the same viewer key', () => {
      selectors.getActiveDocumentViewerKey.mockReturnValue(1);

      const setActiveDocumentViewerKey = setActiveDocumentViewerKeyAPI(mockStore);
      setActiveDocumentViewerKey(1);

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(fireEvent).not.toHaveBeenCalled();
    });

    it('should warn when not in Multi-Viewer Mode', () => {
      selectors.isMultiViewerMode.mockReturnValue(false);

      const setActiveDocumentViewerKey = setActiveDocumentViewerKeyAPI(mockStore);
      setActiveDocumentViewerKey(2);

      expect(console.warn).toHaveBeenCalledWith('setActiveDocumentViewerKey: Multi-Viewer Mode is not enabled');
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(fireEvent).not.toHaveBeenCalled();
    });

    it('should fire event with correct data when changing from 2 to 1', () => {
      selectors.getActiveDocumentViewerKey.mockReturnValue(2);

      const setActiveDocumentViewerKey = setActiveDocumentViewerKeyAPI(mockStore);
      setActiveDocumentViewerKey(1);

      expect(fireEvent).toHaveBeenCalledWith(Events.ACTIVE_DOCUMENT_VIEWER_CHANGED, {
        activeDocumentViewerKey: 1,
        previousDocumentViewerKey: 2,
      });
    });

    it('should validate input with checkTypes accepting 1, 2', () => {
      selectors.getActiveDocumentViewerKey.mockReturnValue(1);

      const setActiveDocumentViewerKey = setActiveDocumentViewerKeyAPI(mockStore);
      setActiveDocumentViewerKey(2);

      expect(mockCheckTypes).toHaveBeenCalledWith(
        [2],
        [
          expect.objectContaining({
            type: 'ONE_OF',
            values: [1, 2],
          })
        ],
        'UI.setActiveDocumentViewerKey'
      );
    });

    it('should warn and not dispatch for invalid keys (not 1 or 2)', () => {
      selectors.getActiveDocumentViewerKey.mockReturnValue(1);

      const setActiveDocumentViewerKey = setActiveDocumentViewerKeyAPI(mockStore);
      const invalidValues = [0, 3, -1, null, undefined, '1', '2', {}, [], NaN];
      invalidValues.forEach((val) => {
        mockCheckTypes.mockImplementationOnce(() => {
          throw new Error('Invalid key');
        });
        expect(() => setActiveDocumentViewerKey(val)).toThrow('Invalid key');
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(fireEvent).not.toHaveBeenCalled();
        expect(mockCheckTypes).toHaveBeenCalledWith(
          [val],
          [expect.objectContaining({ type: 'ONE_OF', values: [1, 2] })],
          'UI.setActiveDocumentViewerKey'
        );
        mockDispatch.mockClear();
        fireEvent.mockClear();
        mockCheckTypes.mockClear();
      });
    });
  });
});
