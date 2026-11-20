import getSpreadsheetCustomDataInt from './getSpreadsheetCustomDataInt';

describe('getSpreadsheetCustomDataInt', () => {
  let mockAnnotation;

  beforeEach(() => {
    mockAnnotation = {
      getCustomData: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse custom data as integer', () => {
    mockAnnotation.getCustomData.mockReturnValue('42');
    const result = getSpreadsheetCustomDataInt(mockAnnotation, 'key');
    expect(result).toBe(42);
  });

  it.each([undefined, null, 'abc', ''])('should return 0 for invalid custom data (%p)', (customData) => {
    mockAnnotation.getCustomData.mockReturnValue(customData);
    const result = getSpreadsheetCustomDataInt(mockAnnotation, 'key');
    expect(result).toBe(0);
  });

  it('should parse zero value', () => {
    mockAnnotation.getCustomData.mockReturnValue('0');
    const result = getSpreadsheetCustomDataInt(mockAnnotation, 'key');
    expect(result).toBe(0);
  });

  it('should parse negative integer', () => {
    mockAnnotation.getCustomData.mockReturnValue('-15');
    const result = getSpreadsheetCustomDataInt(mockAnnotation, 'key');
    expect(result).toBe(-15);
  });

  it('should truncate decimal values', () => {
    mockAnnotation.getCustomData.mockReturnValue('42.99');
    const result = getSpreadsheetCustomDataInt(mockAnnotation, 'key');
    expect(result).toBe(42);
  });

  it('should pass key parameter to getCustomData', () => {
    mockAnnotation.getCustomData.mockReturnValue('10');
    getSpreadsheetCustomDataInt(mockAnnotation, 'myKey');
    expect(mockAnnotation.getCustomData).toHaveBeenCalledWith('myKey');
  });

});
