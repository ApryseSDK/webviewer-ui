import localStorageManager from 'helpers/localStorageManager';

describe('localStorageManager', () => {

  it('should call localStorageManager.getItemSynchronous with the correct keys when restoring custom palettes', () => {
    const getItemSynchronousMock = jest.fn(() => null);
    const isLocalStorageEnabledMock = jest.fn(() => true);
    localStorageManager.getItemSynchronous = getItemSynchronousMock;
    localStorageManager.isLocalStorageEnabled = isLocalStorageEnabledMock;

    jest.resetModules();
    jest.doMock('helpers/getRootNode', () => ({
      __esModule: true,
      getInstanceID: () => 'style-panel-test-instance',
      getInstanceNode: jest.fn(() => window),
      default: jest.fn(() => document),
    }));
    jest.doMock('helpers/localStorageManager', () => ({
      __esModule: true,
      default: {
        isLocalStorageEnabled: isLocalStorageEnabledMock,
        getItemSynchronous: getItemSynchronousMock,
        setItemSynchronous: jest.fn(),
      },
    }));

    jest.isolateModules(() => {
      require('src/redux/initialState');
    });

    expect(getItemSynchronousMock).toHaveBeenCalledWith('style-panel-test-instance-customTextColors');
    expect(getItemSynchronousMock).toHaveBeenCalledWith('style-panel-test-instance-customStrokeColors');
    expect(getItemSynchronousMock).toHaveBeenCalledWith('style-panel-test-instance-customFillColors');
  });
});