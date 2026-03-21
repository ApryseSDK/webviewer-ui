import {
  getCurrentDestViewerCoord,
  getOutlineName,
  normalizeOutlineCoord,
} from './outlinesPanelHelper';

describe('outlinesPanelHelper', () => {
  describe('getCurrentDestViewerCoord', () => {
    it('returns the document viewer coordinates', () => {
      const doc = {
        getViewerCoordinates: jest.fn(() => ({ x: 10, y: 20 })),
      };
      const { x, y } = getCurrentDestViewerCoord(doc, 5, { x: 1, y: 2 });
      expect({ x, y }).toEqual({ x: 10, y: 20 });
    });
  });

  describe('normalizeOutlineCoord', () => {
    const testCases = [
      { rotation: window.Core.PageRotation.E_0, input: { x: 3, y: 7 }, expected: { x: 3, y: 7 } },
      { rotation: window.Core.PageRotation.E_90, input: { x: 3, y: 7 }, expected: { x: 7, y: 3 } },
      { rotation: window.Core.PageRotation.E_180, input: { x: 3, y: 7 }, expected: { x: 3, y: 7 } },
      { rotation: window.Core.PageRotation.E_270, input: { x: 3, y: 7 }, expected: { x: 7, y: 3 } },
    ];

    testCases.forEach(({ rotation, input, expected }) => {
      it(`returns ${JSON.stringify(expected)} for rotation ${rotation}`, () => {
        const result = normalizeOutlineCoord(input, rotation);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('getOutlineName', () => {
    const defaultDestText = 'Full Page';
    const areaDestinationText = 'Area Selection';
    const defaultName = 'Untitled';
    const testCases = [
      {
        description: 'should return the provided name if it exists',
        name: 'Existing Name',
        currentDestText: 'Chapter 1',
        expected: 'Existing Name',
      },
      {
        description: 'should return long name if it exists',
        name: 'This is a very long name that exceeds some number of characters and should all be included in the new outline name',
        currentDestText: 'Chapter 1',
        expected: 'This is a very long name that exceeds some number of characters and should all be included in the new outline name',
      },
      {
        description: 'should use current destination text if name is empty and current destination is not default or area',
        name: '',
        currentDestText: 'Chapter 1',
        expected: 'Chapter 1',
      },
      {
        description: 'should use current destination text if name is null and current destination is not default or area',
        name: null,
        currentDestText: 'Chapter 1',
        expected: 'Chapter 1',
      },

      {
        description: 'should use current destination text if name is undefined and current destination is not default or area',
        name: undefined,
        currentDestText: 'Chapter 1',
        expected: 'Chapter 1',
      },
      {
        description: 'should truncate current destination text',
        name: '',
        currentDestText: 'This is a very long name that exceeds some number of characters and should be truncated in the new outline name',
        expected: 'This is a very long name that exceeds so',
      },
      {
        description: 'should return the default name if name is empty and current destination is default or area',
        name: '',
        currentDestText: 'Full Page',
        expected: 'Untitled',
      },
      {
        description: 'should return name as string if it was provided and was not already a string',
        name: 12345,
        currentDestText: 'Chapter 1',
        expected: '12345',
      },
    ];

    testCases.forEach(({ description, name, currentDestText, expected }) => {
      it(description, () => {
        const result = getOutlineName({ name, currentDestText, defaultDestText, areaDestinationText, defaultName });
        expect(result).toBe(expected);
      });
    });
  });
});