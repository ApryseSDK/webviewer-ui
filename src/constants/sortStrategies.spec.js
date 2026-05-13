import core from 'core';
import { getSortStrategies, getExtendedSortStrategies } from './sortStrategies';

const notes = [
  new Core.Annotations.FreeTextAnnotation('', {
    Color: new Core.Annotations.Color(255, 255, 0, 1),
    TextColor: new Core.Annotations.Color(230, 15, 0, 1),
  }),
  new Core.Annotations.FreeTextAnnotation('', {
    Color: new Core.Annotations.Color(255, 255, 0, 1),
    TextColor: new Core.Annotations.Color(230, 230, 200, 1),
  }),
  new Core.Annotations.FreeTextAnnotation('', {
    Color: new Core.Annotations.Color(255, 255, 0, 1),
    TextColor: new Core.Annotations.Color(230, 15, 0, 1),
  }),
  new Core.Annotations.FreeTextAnnotation('', {
    Color: new Core.Annotations.Color(255, 255, 0, 1),
    TextColor: new Core.Annotations.Color(200, 200, 0, 1),
  }),
  new Core.Annotations.RectangleAnnotation({
    Color: new Core.Annotations.Color(200, 200, 0, 1)
  })
];

describe('Sort Strategies', () => {

  it('should pass documentViewerKey to sort strategy', () => {
    const mockGetRotation = jest.spyOn(core, 'getRotation').mockImplementation(() => 0);
    const mockGetPageInfo = jest.spyOn(core, 'getPageInfo').mockImplementation(() => ({ width: 100, height: 100 }));
    const mockGetTotalPages = jest.spyOn(core, 'getTotalPages').mockReturnValue(1);
    try {
      const sortStrategies = getExtendedSortStrategies();
      const positionStrategy = sortStrategies.position;
      const activeDocumentViewerKey = 2;
      positionStrategy.getSortedNotes(notes, activeDocumentViewerKey);
      expect(mockGetTotalPages).toHaveBeenCalledWith(activeDocumentViewerKey);
    } finally {
      mockGetRotation.mockRestore();
      mockGetPageInfo.mockRestore();
      mockGetTotalPages.mockRestore();
    }
  });

  describe('sort by line position', () => {
    const originalGetRotation = core.getRotation;
    const originalGetPageInfo = core.getPageInfo;
    const originalGetTotalPages = core.getTotalPages;

    beforeEach(() => {
      core.getRotation = () => 0;
      core.getPageInfo = () => ({ width: 100, height: 100 });
      core.getTotalPages = () => 1;
    });

    afterEach(() => {
      core.getRotation = originalGetRotation;
      core.getPageInfo = originalGetPageInfo;
      core.getTotalPages = originalGetTotalPages;
    });

    it('should sort left to right for notes on the same line', () => {
      const notesForLineSort = [
        {
          Id: 'a',
          PageNumber: 1,
          X: 10,
          Y: 10,
          Width: 5,
          Height: 10,
          getQuads: () => [{ x1: 10, y1: 10 }],
        },
        {
          Id: 'c',
          PageNumber: 1,
          X: 20,
          Y: 5,
          Width: 5,
          Height: 10,
          getQuads: () => [{ x1: 20, y1: 5 }],
        },
        {
          Id: 'b',
          PageNumber: 1,
          X: 30,
          Y: 15,
          Width: 5,
          Height: 10,
          getQuads: () => [{ x1: 30, y1: 15 }],
        },
      ];

      const sorted = getExtendedSortStrategies().linePosition.getSortedNotes([...notesForLineSort]);
      const sortedIds = sorted.map((note) => note.Id);

      expect(sortedIds).toEqual(['a', 'c', 'b']);
    });
  });

  describe('sort by color', () => {
    it('should sort by text color for free text annotations', () => {
      const sortStrategies = getSortStrategies();
      const getSortedNotes = sortStrategies.color.getSortedNotes;

      const sortedNotes = getSortedNotes(notes);
      const NotesColorList = sortedNotes.map((note) => {
        if (note instanceof Core.Annotations.FreeTextAnnotation) {
          return note.TextColor;
        }
        return note.Color;
      });
      expect(NotesColorList[0]).toEqual({ R: 230, B: 200, G: 230, A: 1 });
      expect(NotesColorList[1]).toEqual({ R: 230, B: 0, G: 15, A: 1 });
      expect(NotesColorList[2]).toEqual({ R: 230, B: 0, G: 15, A: 1 });
      expect(NotesColorList[3]).toEqual({ R: 200, B: 0, G: 200, A: 1 });
      expect(NotesColorList[4]).toEqual({ R: 200, B: 0, G: 200, A: 1 });
    });

    it('should separate by text color for free text annotations', () => {
      const sortStrategies = getSortStrategies();
      const shouldRenderSeparator = sortStrategies.color.shouldRenderSeparator;
      const separators = [];

      notes.forEach((note, index) => {
        const prevNote = notes[index - 1];

        if (prevNote && shouldRenderSeparator(prevNote, note)) {
          separators.push(index);
        }
      });

      expect(separators.length).toEqual(2);
      expect(separators[0]).toEqual(1);
      expect(separators[1]).toEqual(3);
    });
  });

  describe('sort by author', () => {
    const originalGetDisplayAuthor = core.getDisplayAuthor;

    afterEach(() => {
      core.getDisplayAuthor = originalGetDisplayAuthor;
    });

    it('should sort notes by display author', () => {
      core.getDisplayAuthor = (userId) => userId;
      const sortStrategies = getSortStrategies();
      const authorNotes = [
        { Author: 'Charlie' },
        { Author: 'Alice' },
        { Author: 'Bob' },
      ];

      const sorted = sortStrategies.author.getSortedNotes([...authorNotes]);
      expect(sorted.map((n) => n.Author)).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('should pass documentViewerKey correctly to getSeparatorContent', () => {
      const mockGetDisplayAuthor = jest.spyOn(core, 'getDisplayAuthor').mockImplementation((userId) => userId);
      try {
        const sortStrategies = getSortStrategies();
        const result = sortStrategies.author.getSeparatorContent(null, { Author: 'Alice' }, { pageLabels: [] }, 2);
        expect(mockGetDisplayAuthor).toHaveBeenCalledWith('Alice', 2);
        expect(result).toBe('Alice');
      } finally {
        mockGetDisplayAuthor.mockRestore();
      }
    });

    it('should pass documentViewerKey correctly to shouldRenderSeparator', () => {
      const mockGetDisplayAuthor = jest.spyOn(core, 'getDisplayAuthor').mockImplementation((userId) => userId);
      try {
        const sortStrategies = getSortStrategies();
        sortStrategies.author.shouldRenderSeparator({ Author: 'Alice' }, { Author: 'Bob' }, { pageLabels: [] }, 2);
        expect(mockGetDisplayAuthor).toHaveBeenCalledWith('Alice', 2);
        expect(mockGetDisplayAuthor).toHaveBeenCalledWith('Bob', 2);
      } finally {
        mockGetDisplayAuthor.mockRestore();
      }
    });

    it('should not crash when getDisplayAuthor returns undefined', () => {
      core.getDisplayAuthor = () => undefined;
      const sortStrategies = getSortStrategies();
      const authorNotes = [
        { Author: undefined },
        { Author: 'Alice' },
      ];

      expect(() => {
        sortStrategies.author.getSortedNotes([...authorNotes]);
      }).not.toThrow();
    });
  });
});