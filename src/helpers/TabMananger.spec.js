import { getNextNumberForUntitledDocument } from './TabManager';

describe('getNextNumberForUntitledDocument', () => {
  it('should return 1 when there is no untitled document', () => {
    const tabs = [
      {
        options: {
          filename: 'sample-1',
        },
      },
      {
        options: {
          filename: 'sample-2',
        },
      },
    ];
    const nextNumber = getNextNumberForUntitledDocument(tabs);
    expect(nextNumber).toEqual(1);
  });
  it('should return the next number for an untitled document', () => {
    const tabs = [
      {
        options: {
          filename: 'untitled-1',
        },
      },
      {
        options: {
          filename: 'sample-1',
        },
      },
      {
        options: {
          filename: 'untitled-2',
        },
      },
    ];
    const nextNumber = getNextNumberForUntitledDocument(tabs);
    expect(nextNumber).toEqual(3);
  });
});