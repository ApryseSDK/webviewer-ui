import {
  getPageWidthAndHeight,
  getDefaultDestCoord,
  convertToPDFDestCoord,
  getOutlineName,
  getVisibleOutlines,
  isOutlineExpanded,
} from './outlinesPanelHelper';

const createOutlines = (outlineData, parent = null) => outlineData.map(({ name, children = [] }, index) => {
  const outline = {
    getName: () => name,
    getIndex: () => index,
    getParent: () => parent,
  };
  const childOutlines = createOutlines(children, outline);
  outline.getChildren = () => childOutlines;
  return outline;
});

describe('outlinesPanelHelper', () => {
  describe('isOutlineExpanded', () => {
    it('uses auto-expand as the default while preserving an explicit user choice', () => {
      expect(isOutlineExpanded(undefined, true)).toBe(true);
      expect(isOutlineExpanded({ isExpanded: false }, true)).toBe(false);
      expect(isOutlineExpanded({ isExpanded: true }, false)).toBe(true);
    });
  });

  describe('getVisibleOutlines', () => {
    const outlines = createOutlines([
      {
        name: 'Root 1',
        children: [
          {
            name: 'Child 1.1',
            children: [{ name: 'Grandchild 1.1.1' }],
          },
          { name: 'Child 1.2' },
        ],
      },
      {
        name: 'Root 2',
        children: [{ name: 'Child 2.1' }],
      },
    ]);

    const getNamesAndLevels = (visibleOutlines) => visibleOutlines.map(({ outline, nestingLevel }) => ({
      name: outline.getName(),
      nestingLevel,
    }));

    it('only includes root outlines when all branches are collapsed', () => {
      expect(getNamesAndLevels(getVisibleOutlines(outlines))).toEqual([
        { name: 'Root 1', nestingLevel: 0 },
        { name: 'Root 2', nestingLevel: 0 },
      ]);
    });

    it('includes expanded descendants in tree order with their nesting levels', () => {
      const outlinesStateMap = {
        '0': { isExpanded: true },
        '0-0': { isExpanded: true },
        '1': { isExpanded: true },
      };

      expect(getNamesAndLevels(getVisibleOutlines(outlines, outlinesStateMap))).toEqual([
        { name: 'Root 1', nestingLevel: 0 },
        { name: 'Child 1.1', nestingLevel: 1 },
        { name: 'Grandchild 1.1.1', nestingLevel: 2 },
        { name: 'Child 1.2', nestingLevel: 1 },
        { name: 'Root 2', nestingLevel: 0 },
        { name: 'Child 2.1', nestingLevel: 1 },
      ]);
    });

    it('includes all descendants when outlines are automatically expanded', () => {
      expect(getNamesAndLevels(getVisibleOutlines(outlines, {}, true))).toEqual([
        { name: 'Root 1', nestingLevel: 0 },
        { name: 'Child 1.1', nestingLevel: 1 },
        { name: 'Grandchild 1.1.1', nestingLevel: 2 },
        { name: 'Child 1.2', nestingLevel: 1 },
        { name: 'Root 2', nestingLevel: 0 },
        { name: 'Child 2.1', nestingLevel: 1 },
      ]);
    });

    it('keeps an explicitly collapsed branch hidden when outlines are automatically expanded', () => {
      const outlinesStateMap = {
        '0': { isExpanded: false },
      };

      expect(getNamesAndLevels(getVisibleOutlines(outlines, outlinesStateMap, true))).toEqual([
        { name: 'Root 1', nestingLevel: 0 },
        { name: 'Root 2', nestingLevel: 0 },
        { name: 'Child 2.1', nestingLevel: 1 },
      ]);
    });

    it('flattens a deeply nested expanded outline tree', () => {
      const depth = 10000;
      let child = null;

      for (let index = depth - 1; index >= 0; index--) {
        const currentChild = child;
        child = {
          getChildren: () => currentChild ? [currentChild] : [],
          getIndex: () => 0,
          getParent: () => null,
        };
      }

      const visibleOutlines = getVisibleOutlines([child], {}, true);

      expect(visibleOutlines).toHaveLength(depth);
      expect(visibleOutlines[visibleOutlines.length - 1].nestingLevel).toBe(depth - 1);
    });
  });

  describe('getPageWidthAndHeight', () => {
    const testCases = [
      {
        description: 'should return width and height from getPageInfo when page is not rotated',
        doc: {
          getPageRotation: () => 0,
          getPageInfo: () => ({ width: 612, height: 792 }),
        },
        expected: { width: 612, height: 792 },
      },
      {
        description: 'should swap width and height from getPageInfo when page is rotated 90 degrees',
        doc: {
          getPageRotation: () => 90,
          getPageInfo: () => ({ width: 612, height: 792 }),
        },
        expected: { width: 792, height: 612 },
      },
      {
        description: 'should return width and height from getPageInfo when page is rotated 180 degrees',
        doc: {
          getPageRotation: () => 180,
          getPageInfo: () => ({ width: 612, height: 792 }),
        },
        expected: { width: 612, height: 792 },
      },
      {
        description: 'should swap width and height from getPageInfo when page is rotated 270 degrees',
        doc: {
          getPageRotation: () => 270,
          getPageInfo: () => ({ width: 612, height: 792 }),
        },
        expected: { width: 792, height: 612 },
      },
      {
        description: 'should return 0 for width and height if doc is null',
        doc: null,
        expected: { width: 0, height: 0 },
      },
      {
        description: 'should return 0 for width and height if doc does not have getPageRotation',
        doc: {
          getPageInfo: () => ({ width: 612, height: 792 }),
        },
        expected: { width: 0, height: 0 },
      }
    ];

    for (const { description, doc, expected } of testCases) {
      it(description, () => {
        const result = getPageWidthAndHeight(doc, 1);
        expect(result).toEqual(expected);
      });
    }
  });

  describe('getDefaultDestCoord', () => {
    const testCases = [
      {
        description: 'should return correct default destination coordinates for unrotated page',
        doc: {
          getPageRotation: () => 0,
          getPageInfo: () => ({ width: 612, height: 792 }),
        },
        expected: { x: 0, y: 0 }, // top-left of unrotated page in viewer coordinates
      },
      {
        description: 'should return correct default destination coordinates for page rotated 90 degrees',
        doc: {
          getPageRotation: () => 90,
          getPageInfo: () => ({ width: 792, height: 612 }),
        },
        expected: { x: 0, y: 792 }, // bottom-left of unrotated page in viewer coordinates
      },
      {
        description: 'should return correct default destination coordinates for page rotated 180 degrees',
        doc: {
          getPageRotation: () => 180,
          getPageInfo: () => ({ width: 612, height: 792 }),
        },
        expected: { x: 612, y: 792 }, // bottom-right of unrotated page in viewer coordinates
      },
      {
        description: 'should return correct default destination coordinates for page rotated 270 degrees',
        doc: {
          getPageRotation: () => 270,
          getPageInfo: () => ({ width: 792, height: 612 }),
        },
        expected: { x: 612, y: 0 }, // top-right of unrotated page in viewer coordinates
      },
      {
        description: 'should return {x: 0, y: 0} if doc is null',
        doc: null,
        expected: { x: 0, y: 0 }, // top-left of unrotated page in viewer coordinates
      },
      {
        description: 'should return {x: 0, y: 0} if doc does not have getPageRotation',
        doc: {
          getPageInfo: () => ({ width: 612, height: 792 }),
        },
        expected: { x: 0, y: 0 }, // top-left of unrotated page in viewer coordinates
      },
      {
        description: 'should return { x: 0, y: 0} if doc.getPageRotation does not return a number',
        doc: {
          getPageRotation: () => null,
          getPageInfo: () => ({ width: 612, height: 792 }),
        },
        expected: { x: 0, y: 0 }, // top-left of unrotated page in viewer coordinates
      }
    ];

    for (const { description, doc, expected } of testCases) {
      it(description, () => {
        const result = getDefaultDestCoord(doc, 1);
        expect(result).toEqual(expected);
      });
    }
  });

  describe('convertToPDFDestCoord', () => {
    const testCases = [
      {
        description: 'Drawing outline on top-left corner of PDF page',
        docParams: {
          pageRotation: 0,
          height: 792,
          width: 612,
        },
        pageNum: 1,
        currentDestCoord: { x: 0, y: 0 },
        expectedViewerCoord: { x: 0, y: 792 },
      },
      {
        description: 'Drawing outline on top-right corner of PDF page',
        docParams: {
          pageRotation: 0,
          height: 792,
          width: 612,
        },
        pageNum: 1,
        currentDestCoord: { x: 600, y: 0 },
        expectedViewerCoord: { x: 600, y: 792 },
      },
      {
        description: 'Drawing outline on bottom-left corner of PDF page',
        docParams: {
          pageRotation: 0,
          height: 792,
          width: 612,
        },
        pageNum: 1,
        currentDestCoord: { x: 0, y: 700 },
        expectedViewerCoord: { x: 0, y: 92 },
      },
      {
        description: 'Drawing outline on bottom-right corner of PDF page',
        docParams: {
          pageRotation: 0,
          height: 792,
          width: 612,
        },
        pageNum: 1,
        currentDestCoord: { x: 600, y: 700 },
        expectedViewerCoord: { x: 600, y: 92 },
      },
    ];

    for (const { description, docParams, pageNum, currentDestCoord, expectedViewerCoord } of testCases) {
      for (const rotation of [0, 90, 180, 270]) {
        it(`${description} with page rotation ${rotation}`, () => {
          const doc = {
            getPageRotation: () => rotation,
            getPageInfo: () => {
              if (rotation === 90 || rotation === 270) {
                return { height: docParams.width, width: docParams.height };
              } else {
                return { height: docParams.height, width: docParams.width };
              }
            },
          };
          const result = convertToPDFDestCoord(doc, pageNum, currentDestCoord);
          expect(result).toEqual(expectedViewerCoord);
        });
      }
    }
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
