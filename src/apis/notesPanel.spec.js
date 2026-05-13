import { setStatusList, StatusList } from './notesPanel';
import actions from 'actions';

jest.mock('actions', () => ({
  setStatusList: jest.fn((payload) => ({ type: 'SET_STATUS_LIST', payload })),
}));

describe('NotesPanel API', () => {
  let mockStore;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockStore = { dispatch: mockDispatch };
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    actions.setStatusList.mockImplementation((payload) => ({ type: 'SET_STATUS_LIST', payload }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('StatusList enum', () => {
    it('should expose all 7 standard statuses', () => {
      expect(StatusList.ACCEPTED).toBe('Accepted');
      expect(StatusList.REJECTED).toBe('Rejected');
      expect(StatusList.CANCELLED).toBe('Cancelled');
      expect(StatusList.COMPLETED).toBe('Completed');
      expect(StatusList.NONE).toBe('None');
      expect(StatusList.MARKED).toBe('Marked');
      expect(StatusList.UNMARKED).toBe('Unmarked');
    });
  });

  describe('setStatusList', () => {
    it('should dispatch with valid statuses', () => {
      const api = setStatusList(mockStore);
      api([StatusList.ACCEPTED, StatusList.REJECTED]);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: ['Accepted', 'Rejected'] })
      );
    });

    it('should dispatch with all statuses when all are provided', () => {
      const api = setStatusList(mockStore);
      const allStatuses = Object.values(StatusList);
      api(allStatuses);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: ['Accepted', 'Rejected', 'Cancelled', 'Completed', 'None', 'Marked', 'Unmarked'],
        })
      );
    });

    it('should dispatch with a single status', () => {
      const api = setStatusList(mockStore);
      api([StatusList.NONE]);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: ['None'] })
      );
    });

    it('should dispatch with an empty array', () => {
      const api = setStatusList(mockStore);
      api([]);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: [] })
      );
    });

    it('should filter out unrecognized statuses and warn', () => {
      const api = setStatusList(mockStore);
      api(['Accepted', 'InvalidStatus', 'Rejected']);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('"InvalidStatus" is not a recognized status')
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: ['Accepted', 'Rejected'] })
      );
    });

    it('should filter out all invalid statuses and dispatch empty array', () => {
      const api = setStatusList(mockStore);
      api(['Foo', 'Bar']);

      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: [] })
      );
    });

    it('should deduplicate statuses when duplicates are provided', () => {
      const api = setStatusList(mockStore);
      api([StatusList.ACCEPTED, StatusList.ACCEPTED, StatusList.REJECTED]);

      expect(actions.setStatusList).toHaveBeenCalledWith(
        ['Accepted', 'Rejected']
      );
    });

    it('should warn and not dispatch when argument is not an array', () => {
      const api = setStatusList(mockStore);
      api('Accepted');

      expect(console.warn).toHaveBeenCalledWith(
        'UI.NotesPanel.setStatusList: statuses must be an array of strings.'
      );
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should warn and not dispatch when argument is null', () => {
      const api = setStatusList(mockStore);
      api(null);

      expect(console.warn).toHaveBeenCalledWith(
        'UI.NotesPanel.setStatusList: statuses must be an array of strings.'
      );
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should warn and not dispatch when argument is undefined', () => {
      const api = setStatusList(mockStore);
      api(undefined);

      expect(console.warn).toHaveBeenCalledWith(
        'UI.NotesPanel.setStatusList: statuses must be an array of strings.'
      );
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should warn and not dispatch when argument is an object', () => {
      const api = setStatusList(mockStore);
      api({ status: 'Accepted' });

      expect(console.warn).toHaveBeenCalledWith(
        'UI.NotesPanel.setStatusList: statuses must be an array of strings.'
      );
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
