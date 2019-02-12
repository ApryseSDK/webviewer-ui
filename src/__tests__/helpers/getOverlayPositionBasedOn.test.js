import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';

describe('getoverlayPositionBasedOn', () => {

  const mockOverlay = {
    current: {}
  };
  const mockButton = {
    test: 'test'
  };
  
  test('button is undefined', () => {
    document.querySelector = jest.fn();
    expect(getOverlayPositionBasedOn('test','test')).toEqual({ left: 0, right: 'auto' });
  });

  test('buttonLeft + overlayWidth exceeds innerWidth', () => {
    mockButton.getBoundingClientRect = jest.fn().mockReturnValue({ left: 100 });
    document.querySelector = jest.fn().mockReturnValue(mockButton);
    mockOverlay.current.getBoundingClientRect = jest.fn().mockReturnValue({ width: 100 });
    global.innerWidth = 100;
    expect(getOverlayPositionBasedOn('test',mockOverlay)).toEqual({ left: 'auto', right: 16 });
  });

  test('buttonLeft + overlayWidth is less than innerWidth', () => {
    mockButton.getBoundingClientRect = jest.fn().mockReturnValue({ left: 35 });
    document.querySelector = jest.fn().mockReturnValue(mockButton);
    mockOverlay.current.getBoundingClientRect = jest.fn().mockReturnValue({ width: 0 });
    global.innerWidth = 100;
    expect(getOverlayPositionBasedOn('test',mockOverlay)).toEqual({ left: 35, right: 'auto' });
  });
});